/**
 * useAudioWav — helper audio untuk media tools (recorder, waveform, trimmer).
 * Semua operasi client-side via Web Audio API.
 *
 * - decodeAudioFile(file): File → AudioBuffer
 * - encodeWav(buffer): AudioBuffer → Blob WAV (PCM 16-bit)
 * - computePeaks(buffer, samples): AudioBuffer → number[] (normalized 0..1)
 * - drawWaveform(canvas, peaks, opts): render bars, optional progress highlight
 */

export function decodeAudioFile(file: File, ctx: AudioContext): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const buf = await ctx.decodeAudioData(reader.result as ArrayBuffer);
        resolve(buf);
      } catch (e) {
        reject(new Error('Format audio tidak didukung'));
      }
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsArrayBuffer(file);
  });
}

/** Encode AudioBuffer (mono/stereo) → WAV PCM 16-bit */
export function encodeWav(buffer: AudioBuffer): Blob {
  const numCh = Math.min(buffer.numberOfChannels, 2);
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numCh * 2;
  const out = new ArrayBuffer(44 + length);
  const view = new DataView(out);

  // RIFF header
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);            // fmt chunk size
  view.setUint16(20, 1, true);             // PCM
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numCh * 2, true); // byte rate
  view.setUint16(32, numCh * 2, true);     // block align
  view.setUint16(34, 16, true);            // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, length, true);

  // PCM data
  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numCh; c++) channels.push(buffer.getChannelData(c));
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numCh; c++) {
      let s = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([out], { type: 'audio/wav' });
}

/** Compute downsampled peak array (0..1), satu nilai per bucket */
export function computePeaks(buffer: AudioBuffer, buckets = 240): number[] {
  const ch = buffer.getChannelData(0);
  const peaks: number[] = [];
  const bucketSize = Math.max(1, Math.floor(ch.length / buckets));
  for (let b = 0; b < buckets; b++) {
    let max = 0;
    const start = b * bucketSize;
    const end = Math.min(ch.length, start + bucketSize);
    for (let i = start; i < end; i++) {
      const v = Math.abs(ch[i]);
      if (v > max) max = v;
    }
    peaks.push(max);
  }
  return peaks;
}

export interface WaveformOptions {
  /** warna bar (default accent) */
  color?: string;
  /** warna bagian yang sudah terputar (progress highlight) */
  progressColor?: string;
  /** progress 0..1 — bagian kiri pakai progressColor */
  progress?: number;
  /** background transparent */
  bg?: string;
  barWidth?: number;
  barGap?: number;
}

export function drawWaveform(
  canvas: HTMLCanvasElement,
  peaks: number[],
  opts: WaveformOptions = {}
) {
  const { color = '#38bdf8', progressColor = '#0ea5e9', progress = 0, barWidth = 3, barGap = 1 } = opts;
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const mid = h / 2;
  const step = barWidth + barGap;
  const total = peaks.length * step;
  let x = (w - total) / 2; // center

  for (let i = 0; i < peaks.length; i++) {
    const barH = Math.max(2, peaks[i] * (h - 8));
    const isProgress = i / peaks.length <= progress;
    ctx.fillStyle = isProgress ? progressColor : color;
    ctx.beginPath();
    ctx.roundRect(x, mid - barH / 2, barWidth, barH, barWidth / 2);
    ctx.fill();
    x += step;
  }
}
