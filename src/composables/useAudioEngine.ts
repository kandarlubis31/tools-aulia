/**
 * Web Audio API audio engine for the video editor — preview & export.
 *
 * Preview: each clip's audio is decoded to an `AudioBuffer` once, then scheduled
 * on a live `AudioContext` using the SAME timeline layout as the canvas
 * compositor (`computeTimelineLayout`), so sound and picture stay in sync.
 * Supports trim (offset), speed (playbackRate), volume (gain) and inter-clip
 * transition crossfades.
 *
 * Export: the whole timeline (trim/speed/volume/fades) is rendered into a single
 * `AudioBuffer` via `OfflineAudioContext`, which the WebCodecs exporter muxes
 * into the MP4 (see useWebCodecsExporter.ts).
 *
 * Graceful degradation: if a clip's audio codec cannot be decoded (decodeAudioData
 * rejects — e.g. unusual MKV/MOV audio), that clip is treated as having no audio
 * and is silently skipped. Export via FFmpeg still handles it as a fallback.
 */

import { computeTimelineLayout } from './useVideoCompositor';
import type { TimelineSegment, TransitionType } from './useVideoCompositor';

export interface AudioClip extends TimelineSegment {
  file: Blob;
  /** Volume percent 0..200. */
  volume: number;
  muted: boolean;
}

export interface AudioEngine {
  setClips(clips: AudioClip[], transitionDuration: number): void;
  getDuration(): number;
  /** Decode+probe; resolves true if at least one clip yields audible audio. */
  hasAudio(): Promise<boolean>;
  play(fromTime?: number): Promise<void>;
  pause(): void;
  /** Jump the read position (scrub). Does not auto-play. */
  seek(t: number): void;
  readonly playing: boolean;
  /** Render full timeline audio into one buffer (null if no audible audio). */
  renderTimeline(sampleRate?: number): Promise<AudioBuffer | null>;
  destroy(): void;
}

export const EXPORT_SAMPLE_RATE = 44100;

export function createAudioEngine(): AudioEngine {
  let ctx: AudioContext | null = null;
  let clips: AudioClip[] = [];
  let transitionDuration = 0.8;
  let duration = 0;
  let currentTime = 0;
  let playing = false;

  const buffers = new Map<number | string, AudioBuffer | null>(); // null = no decodable audio
  const decodePromises = new Map<number | string, Promise<AudioBuffer | null>>();
  let activeSources: AudioBufferSourceNode[] = [];

  function ensureCtx(): AudioContext {
    if (!ctx) ctx = new AudioContext();
    return ctx;
  }

  function setClips(c: AudioClip[], td: number): void {
    clips = c;
    transitionDuration = Math.max(0, td);
    const layout = computeTimelineLayout(clips, transitionDuration);
    duration = layout.length ? layout[layout.length - 1].end : 0;
    currentTime = Math.min(currentTime, duration);
    // Drop caches for removed clips.
    const live = new Set(clips.map((c) => c.id));
    for (const id of Array.from(buffers.keys())) if (!live.has(id)) buffers.delete(id);
    for (const id of Array.from(decodePromises.keys())) if (!live.has(id)) decodePromises.delete(id);
  }

  function getDuration(): number {
    return duration;
  }

  function decodeClip(c: AudioClip): Promise<AudioBuffer | null> {
    if (buffers.has(c.id)) return Promise.resolve(buffers.get(c.id)!);
    const existing = decodePromises.get(c.id);
    if (existing) return existing;

    const p = (async () => {
      if (c.muted || c.volume <= 0) return null;
      try {
        const ac = ensureCtx();
        const arr = await c.file.arrayBuffer();
        const buf = await ac.decodeAudioData(arr);
        buffers.set(c.id, buf);
        return buf;
      } catch {
        buffers.set(c.id, null); // unsupported codec → treat as silent
        return null;
      }
    })();
    decodePromises.set(c.id, p);
    return p;
  }

  async function hasAudio(): Promise<boolean> {
    for (const c of clips) {
      if (c.muted || c.volume <= 0) continue;
      const b = await decodeClip(c);
      if (b) return true;
    }
    return false;
  }

  function stopActive(): void {
    for (const s of activeSources) {
      try {
        s.onended = null;
        s.stop();
        s.disconnect();
      } catch {
        /* already stopped */
      }
    }
    activeSources = [];
  }

  /**
   * Schedule a gain envelope (fade-in / hold / fade-out) onto `param`.
   * `when`/`t0` map timeline time → context time: `toCtx(tl) = when + (tl - t0)`.
   */
  function applyEnvelope(
    param: AudioParam,
    vol: number,
    incoming: boolean,
    outgoing: boolean,
    start: number,
    end: number,
    t0: number,
    when: number
  ): void {
    const toCtx = (tl: number) => when + (tl - t0);
    const td = Math.min(transitionDuration, Math.max(0.01, (end - start) / 2));
    const inEnd = start + (incoming ? td : 0.01);
    const outStart = end - (outgoing ? td : 0.01);

    const vAt = (tl: number): number => {
      if (tl <= start) return 0;
      if (tl >= inEnd && tl <= outStart) return vol;
      if (tl < inEnd) return vol * Math.max(0, (tl - start) / Math.max(1e-4, inEnd - start));
      return vol * Math.max(0, 1 - (tl - outStart) / Math.max(1e-4, end - outStart));
    };

    type Ev = [number, number, 'set' | 'ramp'];
    const events: Ev[] = [];
    events.push([t0, vAt(t0), 'set']);
    if (t0 < inEnd && inEnd <= end) events.push([inEnd, vol, 'ramp']);
    if (outStart > t0 && outStart >= inEnd) events.push([outStart, vol, 'set']);
    if (outStart < end) events.push([end, 0, 'ramp']);

    events.sort((a, b) => a[0] - b[0]);
    for (const [tl, v, kind] of events) {
      const t = toCtx(Math.max(t0, tl));
      if (kind === 'set') param.setValueAtTime(v, t);
      else param.linearRampToValueAtTime(v, t);
    }
  }

  function scheduleClip(
    c: AudioClip,
    index: number,
    buffer: AudioBuffer,
    fromTime: number,
    when: number,
    layout: ReturnType<typeof computeTimelineLayout>
  ): void {
    const item = layout[index];
    if (!item || fromTime >= item.end) return;

    const ac = ensureCtx();
    const start = item.start;
    const end = item.end;

    const src = ac.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = Math.max(0.01, c.speed);

    const gain = ac.createGain();
    const vol = c.muted ? 0 : Math.max(0, Math.min(2, c.volume / 100));
    const incoming = index > 0 && clips[index - 1].transitionOut !== 'none';
    const outgoing = c.transitionOut !== 'none';
    applyEnvelope(gain.gain, vol, incoming, outgoing, start, end, fromTime, when);

    src.connect(gain);
    gain.connect(ac.destination);

    // At timeline time t, source time = srcIn + (t - start) * speed.
    const offset = c.srcIn + Math.max(0, fromTime - start) * c.speed;
    const remaining = Math.max(0, end - fromTime);
    src.start(when, offset, remaining * c.speed);
    src.stop(when + remaining + 0.02);

    src.onended = () => {
      const i = activeSources.indexOf(src);
      if (i !== -1) activeSources.splice(i, 1);
    };
    activeSources.push(src);
  }

  async function play(fromTime: number = currentTime): Promise<void> {
    if (!clips.length || duration <= 0) return;
    const ac = ensureCtx();
    if (ac.state === 'suspended') await ac.resume().catch(() => {});
    stopActive();
    playing = true;
    currentTime = Math.max(0, Math.min(fromTime, duration));

    const when = ac.currentTime + 0.05;
    const layout = computeTimelineLayout(clips, transitionDuration);
    for (let i = 0; i < clips.length; i++) {
      const buf = await decodeClip(clips[i]);
      if (!buf) continue;
      scheduleClip(clips[i], i, buf, currentTime, when, layout);
    }
  }

  function pause(): void {
    playing = false;
    stopActive();
  }

  function seek(t: number): void {
    pause();
    currentTime = Math.max(0, Math.min(t, duration));
  }

  async function renderTimeline(sampleRate: number = EXPORT_SAMPLE_RATE): Promise<AudioBuffer | null> {
    const layout = computeTimelineLayout(clips, transitionDuration);
    const totalDur = layout.length ? layout[layout.length - 1].end : 0;
    if (!totalDur) return null;

    const decoded = await Promise.all(clips.map((c) => decodeClip(c)));
    if (!decoded.some(Boolean)) return null;

    const length = Math.max(1, Math.ceil(totalDur * sampleRate));
    const offline = new OfflineAudioContext(2, length, sampleRate);

    for (let i = 0; i < clips.length; i++) {
      const buf = decoded[i];
      if (!buf) continue;
      const c = clips[i];
      const item = layout[i];

      const src = offline.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = Math.max(0.01, c.speed);

      const gain = offline.createGain();
      const vol = c.muted ? 0 : Math.max(0, Math.min(2, c.volume / 100));
      const incoming = i > 0 && clips[i - 1].transitionOut !== 'none';
      const outgoing = c.transitionOut !== 'none';
      applyEnvelope(gain.gain, vol, incoming, outgoing, item.start, item.end, item.start, item.start);

      src.connect(gain);
      gain.connect(offline.destination);
      src.start(item.start, c.srcIn, (c.srcOut - c.srcIn) / c.speed);
    }

    return offline.startRendering();
  }

  function destroy(): void {
    pause();
    if (ctx) {
      ctx.close().catch(() => {});
      ctx = null;
    }
    buffers.clear();
    decodePromises.clear();
  }

  return {
    setClips,
    getDuration,
    hasAudio,
    play,
    pause,
    seek,
    get playing() {
      return playing;
    },
    renderTimeline,
    destroy,
  };
}
