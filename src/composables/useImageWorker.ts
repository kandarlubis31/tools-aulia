/**
 * Client for the shared image-processing worker (public/workers/image-worker.js).
 * Offloads heavy per-pixel math (sharpen, …) off the main thread so the UI
 * stays responsive on low-end devices. Pixel buffers are transferred zero-copy
 * (ArrayBuffer transferable), so there is no extra copy cost.
 *
 * @example
 * const sharpened = await sharpenPixels(imgData.data, width, height);
 * ctx.putImageData(new ImageData(sharpened, width, height), 0, 0);
 */

let worker: Worker | null = null;
let seq = 0;
const pending = new Map<
  number,
  { resolve: (v: Uint8ClampedArray) => void; reject: (e: Error) => void }
>();

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker('/workers/image-worker.js');

    worker.onmessage = (e: MessageEvent) => {
      const { id, ok, result, error } = e.data || {};
      const p = pending.get(id);
      if (!p) return;
      pending.delete(id);
      if (!ok) {
        p.reject(new Error(error || 'Image worker error'));
        return;
      }
      p.resolve(new Uint8ClampedArray(result as ArrayBuffer));
    };

    worker.onerror = (e: ErrorEvent) => {
      const err = new Error(e.message || 'Image worker crashed');
      pending.forEach((p) => p.reject(err));
      pending.clear();
    };
  }
  return worker;
}

/** Transfer the exact bytes of a typed array as an ArrayBuffer. */
function toExactBuffer(data: Uint8ClampedArray): ArrayBuffer {
  if (data.byteOffset === 0 && data.buffer.byteLength === data.byteLength) {
    return data.buffer;
  }
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
}

/**
 * Sharpen an RGBA pixel buffer with a 3x3 convolution kernel.
 * The input buffer is transferred (detached) — do not reuse it afterwards.
 * Returns a new Uint8ClampedArray of the same length.
 */
export function sharpenPixels(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Promise<Uint8ClampedArray> {
  return new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    const buffer = toExactBuffer(data);
    getWorker().postMessage(
      { id, op: 'sharpen', payload: { data: buffer, width, height } },
      [buffer]
    );
  });
}
