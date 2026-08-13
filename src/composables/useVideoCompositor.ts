/**
 * Canvas 2D + requestAnimationFrame compositor — real-time preview engine for
 * the video editor.
 *
 * Core idea: instead of playing a single <video> (which can only show ONE
 * source clip), we own a clock (requestAnimationFrame) and, on every tick,
 * re-draw whichever clip(s) are active at that moment onto a canvas — applying
 * trim, speed, crop, rotation, opacity and inter-clip transitions live.
 * This is the same architecture real editors (CapCut Web, Clipchamp) use for
 * their preview: scrub the timeline and see the *composited* result instantly.
 *
 * Frame sourcing is injected (`FrameSource`), so the SAME compositing code
 * drives both:
 *   - preview (a <video> element seek — simple, zero deps), and
 *   - export  (WebCodecs `VideoDecoder` frames — see useWebCodecsExporter.ts).
 *
 * @example
 * const comp = createCompositor(canvas, { width: 1280, height: 720 });
 * comp.setTimeline([clipA, clipB]);
 * await comp.seek(2.5);   // scrub → render a single frame
 * comp.play();            // real-time playback loop
 */

export type TransitionType =
  | 'none'
  | 'fade'
  | 'fadeblack'
  | 'slideleft'
  | 'slideright'
  | 'wipeleft'
  | 'wiperight';

export type CropRatio = 'none' | '1:1' | '16:9' | '9:16' | '4:5' | '4:3' | '3:2';

const CROP_RATIOS: Record<Exclude<CropRatio, 'none'>, number> = {
  '1:1': 1,
  '16:9': 16 / 9,
  '9:16': 9 / 16,
  '4:5': 4 / 5,
  '4:3': 4 / 3,
  '3:2': 3 / 2,
};

export type DrawContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

/** A decoded, drawable frame at some source time. Caller must `close()` it. */
export interface Frame {
  readonly width: number;
  readonly height: number;
  /** Draw a source sub-rect `(sx,sy,sw,sh)` into destination `(dx,dy,dw,dh)`. */
  draw(
    ctx: DrawContext,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ): void;
  close(): void;
}

/**
 * How a clip's frame pixels are produced. Decouples compositing from decoding:
 * the compositor only ever asks "give me the frame at source-time t".
 */
export interface FrameSource {
  readonly width: number;
  readonly height: number;
  getFrame(t: number): Promise<Frame>;
}

export interface CompositorClip {
  id: string | number;
  source: FrameSource;
  /** Source in/out points (seconds). The clip only plays this window. */
  srcIn: number;
  srcOut: number;
  /** Playback speed. Output duration = (srcOut - srcIn) / speed. */
  speed: number;
  /** Rotation in degrees, one of 0/90/180/270. */
  rotation: number;
  /** Center-crop to a target aspect ratio ('none' = keep full frame). */
  crop: CropRatio;
  /** Uniform opacity 0..1. */
  opacity: number;
  /** Transition applied INTO the next clip. */
  transitionOut: TransitionType;
}

export interface WatermarkSpec {
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size: number;
  color: string;
  font?: string;
}

export interface CompositorOptions {
  width: number;
  height: number;
  /** Transition overlap (seconds) when a transition is active. Default 0.8. */
  transitionDuration?: number;
  watermark?: WatermarkSpec | null;
}

interface LaidClip {
  clip: CompositorClip;
  start: number; // timeline start (sec)
  end: number; // timeline end (sec)
}

interface ClipDrawOpts {
  alpha: number;
  dx: number; // horizontal slide offset (px) for slide transitions
  clip: [number, number] | null; // [x, width] region to reveal (wipe transitions)
}

export interface VideoCompositor {
  setTimeline(clips: CompositorClip[]): void;
  setWatermark(wm: WatermarkSpec | null): void;
  setTransitionDuration(d: number): void;
  getDuration(): number;
  getCurrentTime(): number;
  /** Render a single frame at time `t` (scrub). */
  renderFrame(t: number): Promise<void>;
  seek(t: number): Promise<void>;
  play(): void;
  pause(): void;
  readonly playing: boolean;
  onTimeUpdate: ((t: number) => void) | null;
  destroy(): void;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function createCompositor(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  options: CompositorOptions
): VideoCompositor {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context tidak tersedia');

  const width = options.width;
  const height = options.height;
  let transitionDuration = options.transitionDuration ?? 0.8;
  canvas.width = width;
  canvas.height = height;

  let clips: CompositorClip[] = [];
  let layout: LaidClip[] = [];
  let duration = 0;
  let watermark: WatermarkSpec | null = options.watermark ?? null;
  let currentTime = 0;

  let playing = false;
  let rafId = 0;
  let lastTs = 0;
  let onTimeUpdate: ((t: number) => void) | null = null;

  // Async render pipeline: a slow frame (seek/decode) must not pile up behind
  // rAF ticks. Only one render is in flight; newer requests win.
  let rendering = false;
  let pendingTime: number | null = null;

  function computeLayout(): void {
    layout = [];
    let cursor = 0;
    for (let i = 0; i < clips.length; i++) {
      const c = clips[i];
      const outDur = Math.max(0.001, (c.srcOut - c.srcIn) / Math.max(0.01, c.speed));
      const prev = i > 0 ? layout[i - 1] : null;
      const start =
        prev && prev.clip.transitionOut !== 'none'
          ? prev.end - transitionDuration
          : cursor;
      layout.push({ clip: c, start, end: start + outDur });
      cursor = start + outDur;
    }
    duration = layout.length ? layout[layout.length - 1].end : 0;
  }

  function setTimeline(c: CompositorClip[]): void {
    clips = c;
    computeLayout();
    currentTime = Math.min(currentTime, duration);
  }

  function setWatermark(wm: WatermarkSpec | null): void {
    watermark = wm;
  }

  function setTransitionDuration(d: number): void {
    transitionDuration = Math.max(0, d);
    computeLayout();
    currentTime = Math.min(currentTime, duration);
  }

  /** Center-crop `frame` to `cropRatio`, contain-fit onto canvas, then rotate. */
  async function drawClip(laid: LaidClip, srcT: number, opts: ClipDrawOpts): Promise<void> {
    const c = laid.clip;
    const frame = await c.source.getFrame(srcT);
    try {
      const cropRatio = c.crop === 'none' ? null : CROP_RATIOS[c.crop as Exclude<CropRatio, 'none'>];

      let sw = frame.width;
      let sh = frame.height;
      let sx = 0;
      let sy = 0;
      if (cropRatio) {
        const aspect = sw / (sh || 1);
        if (aspect > cropRatio) {
          sw = sh * cropRatio;
          sx = (frame.width - sw) / 2;
        } else {
          sh = sw / cropRatio;
          sy = (frame.height - sh) / 2;
        }
      }

      const scale = Math.min(width / (sw || 1), height / (sh || 1));
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = opts.dx + (width - dw) / 2;
      const dy = (height - dh) / 2;

      ctx.save();
      if (c.rotation) {
        ctx.translate(width / 2, height / 2);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.translate(-width / 2, -height / 2);
      }
      ctx.globalAlpha = opts.alpha;
      if (opts.clip) {
        ctx.beginPath();
        ctx.rect(opts.clip[0], 0, opts.clip[1], height);
        ctx.clip();
      }
      frame.draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.restore();
    } finally {
      frame.close();
    }
  }

  /** Compute alpha/slide/clip for a clip given its (in/out) transition state. */
  function transitionFor(i: number, laid: LaidClip, t: number): ClipDrawOpts {
    const c = laid.clip;
    let alpha = clamp01(c.opacity);
    let dx = 0;
    let clip: [number, number] | null = null;

    // Incoming transition (from the previous clip's transitionOut).
    if (i > 0) {
      const inType = clips[i - 1].transitionOut;
      if (inType !== 'none' && t < laid.start + transitionDuration) {
        const p = clamp01((t - laid.start) / transitionDuration);
        switch (inType) {
          case 'fade':
          case 'fadeblack':
            alpha *= p;
            break;
          case 'slideleft':
            dx = (1 - p) * width;
            break;
          case 'slideright':
            dx = -(1 - p) * width;
            break;
          case 'wipeleft':
            clip = [width * (1 - p), width * p];
            break;
          case 'wiperight':
            clip = [0, width * p];
            break;
        }
      }
    }

    // Outgoing transition (this clip's transitionOut, into the next clip).
    if (c.transitionOut !== 'none' && i + 1 < clips.length) {
      const p = clamp01((laid.end - t) / transitionDuration);
      if (p > 0 && p < 1) {
        switch (c.transitionOut) {
          case 'fade':
          case 'fadeblack':
            alpha *= 1 - p;
            break;
          case 'slideleft':
            dx = -p * width;
            break;
          case 'slideright':
            dx = p * width;
            break;
          // wipe: the incoming clip reveals over the outgoing one — nothing to do here.
        }
      }
    }

    return { alpha, dx, clip };
  }

  function drawWatermark(): void {
    if (!watermark || !watermark.text) return;
    const size = watermark.size || 32;
    const pad = 16;
    ctx.save();
    ctx.font = `bold ${size}px ${watermark.font || 'system-ui, sans-serif'}`;
    ctx.fillStyle = watermark.color || 'rgba(255,255,255,0.85)';
    ctx.textBaseline = 'middle';
    const w = ctx.measureText(watermark.text).width;
    let x: number;
    let y: number;
    switch (watermark.position) {
      case 'top-left':
        ctx.textAlign = 'left';
        x = pad;
        y = pad + size / 2;
        break;
      case 'top-right':
        ctx.textAlign = 'right';
        x = width - pad;
        y = pad + size / 2;
        break;
      case 'bottom-left':
        ctx.textAlign = 'left';
        x = pad;
        y = height - pad - size / 2;
        break;
      case 'center':
        ctx.textAlign = 'center';
        x = width / 2;
        y = height / 2;
        break;
      case 'bottom-right':
      default:
        ctx.textAlign = 'right';
        x = width - pad;
        y = height - pad - size / 2;
        break;
    }
    ctx.fillText(watermark.text, x, y);
    ctx.restore();
  }

  async function doRender(t: number): Promise<void> {
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < layout.length; i++) {
      const laid = layout[i];
      if (t < laid.start || t >= laid.end) continue;
      const srcT = laid.clip.srcIn + (t - laid.start) * laid.clip.speed;
      await drawClip(laid, srcT, transitionFor(i, laid, t));
    }

    // fadeblack: dip through a black overlay at the overlap midpoint.
    for (let i = 1; i < layout.length; i++) {
      const inType = clips[i - 1].transitionOut;
      const start = layout[i].start;
      if (inType === 'fadeblack' && t >= start && t < start + transitionDuration) {
        const p = (t - start) / transitionDuration;
        const a = 1 - Math.abs(1 - 2 * p); // 0 → 1 → 0
        ctx.fillStyle = '#000';
        ctx.globalAlpha = a;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }
    }

    drawWatermark();
  }

  function renderFrame(t: number): Promise<void> {
    const target = clamp01(t / Math.max(0.001, duration)) * duration;
    if (rendering) {
      pendingTime = target;
      return Promise.resolve();
    }
    rendering = true;
    return (async () => {
      try {
        await doRender(target);
      } finally {
        rendering = false;
        if (pendingTime !== null) {
          const next = pendingTime;
          pendingTime = null;
          void renderFrame(next);
        }
      }
    })();
  }

  function seek(t: number): Promise<void> {
    currentTime = clamp01(t / Math.max(0.001, duration)) * duration;
    return renderFrame(currentTime);
  }

  function loop(ts: number): void {
    if (!playing) return;
    const dt = lastTs ? (ts - lastTs) / 1000 : 0;
    lastTs = ts;
    currentTime = Math.min(duration, currentTime + dt);
    onTimeUpdate?.(currentTime);
    void renderFrame(currentTime);
    if (currentTime >= duration) {
      pause();
      return;
    }
    rafId = requestAnimationFrame(loop);
  }

  function play(): void {
    if (playing || duration <= 0) return;
    playing = true;
    lastTs = 0;
    if (currentTime >= duration) currentTime = 0;
    rafId = requestAnimationFrame(loop);
  }

  function pause(): void {
    playing = false;
    lastTs = 0;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function destroy(): void {
    pause();
    onTimeUpdate = null;
  }

  return {
    setTimeline,
    setWatermark,
    setTransitionDuration,
    getDuration: () => duration,
    getCurrentTime: () => currentTime,
    renderFrame,
    seek,
    play,
    pause,
    get playing() {
      return playing;
    },
    get onTimeUpdate() {
      return onTimeUpdate;
    },
    set onTimeUpdate(v) {
      onTimeUpdate = v;
    },
    destroy,
  };
}

/**
 * FrameSource backed by a plain <video> element (preview path, zero deps).
 * Not frame-accurate — seeking latency is a few ms — so prefer the WebCodecs
 * source (see useWebCodecsExporter) for export or heavy scrubbing.
 */
export function createVideoElementSource(
  video: HTMLVideoElement,
  width: number,
  height: number
): FrameSource {
  let ready: Promise<void> | null = null;

  const ensureReady = (): Promise<void> => {
    if (ready) return ready;
    ready = new Promise<void>((resolve, reject) => {
      if (video.readyState >= 1) {
        resolve();
        return;
      }
      const onMeta = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        reject(new Error('Metadata video gagal dimuat'));
      };
      const cleanup = () => {
        video.removeEventListener('loadedmetadata', onMeta);
        video.removeEventListener('error', onErr);
      };
      video.addEventListener('loadedmetadata', onMeta, { once: true });
      video.addEventListener('error', onErr, { once: true });
      video.load();
    });
    return ready;
  };

  return {
    width,
    height,
    async getFrame(t) {
      await ensureReady();
      if (Math.abs(video.currentTime - t) > 0.001) {
        await new Promise<void>((resolve, reject) => {
          const onSeek = () => {
            cleanup();
            resolve();
          };
          const onErr = () => {
            cleanup();
            reject(new Error('Seek video gagal'));
          };
          const cleanup = () => {
            video.removeEventListener('seeked', onSeek);
            video.removeEventListener('error', onErr);
          };
          video.addEventListener('seeked', onSeek, { once: true });
          video.addEventListener('error', onErr, { once: true });
          try {
            video.currentTime = t;
          } catch (e) {
            cleanup();
            reject(e);
          }
        });
      }
      return {
        width,
        height,
        draw(ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
          ctx.drawImage(video, sx, sy, sw, sh, dx, dy, dw, dh);
        },
        close() {},
      };
    },
  };
}
