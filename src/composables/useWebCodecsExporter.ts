/**
 * WebCodecs export pipeline: decode → composite → encode (GPU) → mux → MP4.
 *
 * NOTE ON "mp4-muxer": the npm package `mp4-muxer` is DEPRECATED. Its author
 * superseded it with **Mediabunny**, which ships the same MP4 muxer plus
 * demuxers, WebCodecs abstractions, and format support — all tree-shakable.
 * We use Mediabunny here (the maintained successor). The WebCodecs
 * `VideoDecoder`/`VideoEncoder` concepts are identical to what `mp4-muxer`
 * users wired manually; Mediabunny just removes the boilerplate.
 *
 * Three layers, from high-level to low-level:
 *   1. `exportTimeline()`        — composite the timeline to an MP4 blob
 *                                  (CanvasSource → VideoEncoder → MP4 mux).
 *   2. `createFrameSourceFromFile()` — frame-accurate `FrameSource` for the
 *                                  compositor (WebCodecs decode under the hood).
 *   3. `createRawVideoDecoder()` — the raw WebCodecs `VideoDecoder` building
 *                                  block (educational / full control).
 */

import {
  Input,
  Output,
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Quality,
  VideoSampleSink,
  EncodedPacketSink,
} from 'mediabunny';
import type { FrameSource } from './useVideoCompositor';

export function supportsWebCodecs(): boolean {
  return typeof VideoEncoder !== 'undefined' && typeof VideoDecoder !== 'undefined';
}

/** Frame-accurate FrameSource backed by WebCodecs hardware decoding. */
export async function createFrameSourceFromFile(file: Blob): Promise<FrameSource> {
  if (!supportsWebCodecs()) throw new Error('Browser tidak mendukung WebCodecs');

  const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
  const track = await input.getPrimaryVideoTrack();
  if (!track) throw new Error('File tidak punya video track');
  if (!(await track.canDecode())) throw new Error('Codec video tidak bisa didecode');

  const sink = new VideoSampleSink(track);
  const width = await track.getDisplayWidth();
  const height = await track.getDisplayHeight();

  return {
    width,
    height,
    async getFrame(t) {
      const sample = await sink.getSample(t);
      return {
        width: sample.displayWidth,
        height: sample.displayHeight,
        draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
          sample.draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh);
        },
        close() {
          sample.close();
        },
      };
    },
  };
}

export interface RawVideoDecoder {
  readonly width: number;
  readonly height: number;
  /** Decode the frame nearest to `t` (seconds). Caller MUST `frame.close()`. */
  getFrame(t: number): Promise<VideoFrame>;
}

/**
 * Low-level WebCodecs `VideoDecoder` over Mediabunny's demuxer.
 *
 * This is the raw building block: configure a `VideoDecoder` with the track's
 * codec config, feed it `EncodedVideoChunk`s in decode order, and collect
 * `VideoFrame`s. Random access works by seeking to the closest key packet and
 * decoding forward until we pass the target time (memory-bounded window).
 *
 * For most cases `createFrameSourceFromFile()` (which wraps `VideoSampleSink`)
 * is simpler and equally accurate — use this when you need direct VideoFrame
 * access (e.g. pushing raw frames into your own encoder).
 */
export async function createRawVideoDecoder(file: Blob): Promise<RawVideoDecoder> {
  if (!supportsWebCodecs()) throw new Error('Browser tidak mendukung WebCodecs');

  const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });
  const track = await input.getPrimaryVideoTrack();
  if (!track) throw new Error('File tidak punya video track');

  const config = await track.getDecoderConfig();
  const sink = new EncodedPacketSink(track);
  const width = config.codedWidth ?? (await track.getDisplayWidth());
  const height = config.codedHeight ?? (await track.getDisplayHeight());

  return {
    width,
    height,
    async getFrame(t) {
      const keyPacket = await sink.getKeyPacket(t);
      let out: VideoFrame | null = null;
      let err: Error | null = null;

      const decoder = new VideoDecoder({
        output: (frame) => {
          if (out) out.close();
          out = frame; // keep the most recent frame ≤ target
        },
        error: (e) => {
          err = e as Error;
        },
      });
      decoder.configure(config);

      let packet = keyPacket;
      let guard = 0;
      while (packet && guard++ < 5000) {
        decoder.decode(packet.toEncodedVideoChunk());
        if (packet.timestamp >= t) break;
        packet = await sink.getNextPacket(packet);
      }
      await decoder.flush();
      decoder.close();

      if (err) throw err;
      if (!out) throw new Error('Frame tidak ditemukan');
      return out;
    },
  };
}

export type ExportQuality = 'low' | 'medium' | 'high';

export interface ExportTimelineOptions {
  width: number;
  height: number;
  fps: number;
  /** Total output duration in seconds. */
  duration: number;
  quality?: ExportQuality;
  /**
   * Draw the composited frame at time `t` (seconds) onto `canvas`.
   * Tip: bind a `VideoCompositor` to this OffscreenCanvas and call
   * `await compositor.renderFrame(t)` here.
   */
  renderFrame: (t: number, canvas: OffscreenCanvas) => Promise<void>;
  onProgress?: (progress: number) => void;
}

/**
 * Composite the timeline to an MP4 blob using WebCodecs hardware encoding +
 * Mediabunny's MP4 muxer. Runs fully on-device (GPU), no upload.
 */
export async function exportTimeline(opts: ExportTimelineOptions): Promise<Blob> {
  if (!supportsWebCodecs()) throw new Error('Browser tidak mendukung WebCodecs');

  const { width, height, fps, duration, quality = 'high' } = opts;
  const canvas = new OffscreenCanvas(width, height);

  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  });
  const videoSource = new CanvasSource(canvas, {
    codec: 'avc',
    quality: new Quality(quality),
  });
  output.addVideoTrack(videoSource);
  await output.start();

  const totalFrames = Math.max(1, Math.round(duration * fps));
  for (let f = 0; f <= totalFrames; f++) {
    const t = Math.min(duration, f / fps);
    await opts.renderFrame(t, canvas);
    // `add(timestamp, duration)` in seconds; awaited to respect encoder backpressure.
    await videoSource.add(t, 1 / fps);
    opts.onProgress?.(f / totalFrames);
  }

  await output.finalize();
  const buffer = output.target.buffer;
  return new Blob([buffer], { type: 'video/mp4' });
}
