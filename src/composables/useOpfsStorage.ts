/**
 * OPFS (Origin Private File System) chunked storage for large video files.
 *
 * Problem: imported video files can be hundreds of MB. Keeping them as blob
 * URLs (in-memory) or single OPFS files means either RAM pressure or no way to
 * stream/demux incrementally. Solution: split each file into fixed-size chunks
 * and store them under a per-file directory, so we can:
 *   - write/read without ever holding the whole file in memory,
 *   - stream chunks (e.g. feed a demuxer incrementally via `streamChunks`),
 *   - survive page reloads (OPFS is persistent), and
 *   - delete files individually.
 *
 * Directory layout:
 *   /video-editor/files/<id>/
 *     meta.json      — StoredFileMeta
 *     chunk-00000
 *     chunk-00001
 *     ...
 *
 * Performance note: the async `FileSystemFileHandle` API below works on the
 * main thread. For maximum throughput (and to avoid jank), run storage in a
 * Worker and use `FileSystemFileHandle.createSyncAccessHandle()` — the sync API
 * is only available in workers.
 */

export interface StoredFileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  chunkSize: number;
  chunkCount: number;
  savedAt: number;
  width?: number;
  height?: number;
}

const ROOT = 'video-editor';
const DEFAULT_CHUNK_SIZE = 8 * 1024 * 1024; // 8 MB

// lib.dom.d.ts (TS 5.9) belum men-declare async iteration / entries() pada
// FileSystemDirectoryHandle, padahal browser modern sudah support keduanya.
interface DirectoryIterable extends FileSystemDirectoryHandle {
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
}

export function isOpfsSupported(): boolean {
  try {
    return typeof navigator !== 'undefined' && !!navigator.storage?.getDirectory;
  } catch {
    return false;
  }
}

async function getRoot(): Promise<FileSystemDirectoryHandle> {
  if (!isOpfsSupported()) throw new Error('OPFS tidak didukung browser ini');
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(ROOT, { create: true });
}

async function getFileDir(id: string): Promise<FileSystemDirectoryHandle> {
  const root = await getRoot();
  const files = await root.getDirectoryHandle('files', { create: true });
  return files.getDirectoryHandle(id, { create: true });
}

const chunkName = (i: number) => `chunk-${String(i).padStart(5, '0')}`;

/**
 * Store a File/Blob as fixed-size chunks under `/video-editor/files/<id>/`.
 * Returns the metadata record. `onProgress(done, total)` is called per chunk.
 */
export async function saveFileChunked(
  file: Blob,
  options: {
    id?: string;
    chunkSize?: number;
    meta?: { width?: number; height?: number };
    onProgress?: (done: number, total: number) => void;
  } = {}
): Promise<StoredFileMeta> {
  const id = options.id ?? (crypto.randomUUID ? crypto.randomUUID() : `f-${Date.now()}`);
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const dir = await getFileDir(id);
  const chunkCount = Math.max(1, Math.ceil(file.size / chunkSize));

  for (let i = 0; i < chunkCount; i++) {
    const slice = file.slice(i * chunkSize, Math.min(file.size, (i + 1) * chunkSize));
    const fh = await dir.getFileHandle(chunkName(i), { create: true });
    const w = await fh.createWritable();
    await w.write(slice);
    await w.close();
    options.onProgress?.(i + 1, chunkCount);
  }

  const meta: StoredFileMeta = {
    id,
    name: (file as File).name || 'clip',
    size: file.size,
    type: file.type || 'video/mp4',
    chunkSize,
    chunkCount,
    savedAt: Date.now(),
    ...options.meta,
  };
  const mh = await dir.getFileHandle('meta.json', { create: true });
  const mw = await mh.createWritable();
  await mw.write(JSON.stringify(meta));
  await mw.close();
  return meta;
}

/** Read a stored file's metadata back (or null if it does not exist). */
export async function getStoredMeta(id: string): Promise<StoredFileMeta | null> {
  try {
    const dir = await getFileDir(id);
    const mh = await dir.getFileHandle('meta.json');
    const f = await mh.getFile();
    return JSON.parse(await f.text()) as StoredFileMeta;
  } catch {
    return null;
  }
}

/** Reassemble a stored file into a Blob. `onProgress(done, total)` per chunk. */
export async function readFileChunked(
  meta: StoredFileMeta,
  onProgress?: (done: number, total: number) => void
): Promise<Blob> {
  const dir = await getFileDir(meta.id);
  const parts: Blob[] = [];
  for (let i = 0; i < meta.chunkCount; i++) {
    const fh = await dir.getFileHandle(chunkName(i));
    parts.push(await fh.getFile());
    onProgress?.(i + 1, meta.chunkCount);
  }
  return new Blob(parts, { type: meta.type });
}

/** Create an object URL for a stored file (reassembled). Remember to revoke it. */
export async function createObjectUrl(meta: StoredFileMeta): Promise<string> {
  const blob = await readFileChunked(meta);
  return URL.createObjectURL(blob);
}

/**
 * Stream a stored file chunk-by-chunk (no full in-memory reassembly).
 * Useful for feeding a demuxer incrementally (`mp4box` / `mediabunny`).
 */
export function streamChunks(meta: StoredFileMeta): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (i >= meta.chunkCount) {
        controller.close();
        return;
      }
      const dir = await getFileDir(meta.id);
      const fh = await dir.getFileHandle(chunkName(i));
      const buf = new Uint8Array(await (await fh.getFile()).arrayBuffer());
      controller.enqueue(buf);
      i++;
    },
  });
}

/** List all stored files (sorted newest first). */
export async function listStoredFiles(): Promise<StoredFileMeta[]> {
  const root = await getRoot();
  const files = await root.getDirectoryHandle('files', { create: true });
  const out: StoredFileMeta[] = [];
  for await (const [name, handle] of (files as DirectoryIterable).entries()) {
    if (handle.kind !== 'directory') continue;
    const meta = await getStoredMeta(name);
    if (meta) out.push(meta);
  }
  return out.sort((a, b) => b.savedAt - a.savedAt);
}

/** Delete one stored file (and its directory). */
export async function deleteStoredFile(id: string): Promise<void> {
  const root = await getRoot();
  const files = await root.getDirectoryHandle('files', { create: true });
  try {
    await files.removeEntry(id, { recursive: true });
  } catch {
    /* already gone */
  }
}

/** Delete everything under `/video-editor`. */
export async function clearAll(): Promise<void> {
  const root = await getRoot();
  try {
    await root.removeEntry(ROOT, { recursive: true });
  } catch {
    /* already gone */
  }
}

/** Report OPFS usage/quota (bytes). */
export async function getUsage(): Promise<{ usage: number; quota: number }> {
  if (!navigator.storage?.estimate) return { usage: 0, quota: 0 };
  const est = await navigator.storage.estimate();
  return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
}
