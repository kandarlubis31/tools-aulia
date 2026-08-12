/**
 * Image-processing worker (off-main-thread pixel ops).
 * Serves heavy per-pixel math that would otherwise freeze the UI on low-end
 * devices (e.g. the 3x3 sharpen convolution in the upscaler).
 *
 * Protocol (main -> worker):
 *   { id: number, op: string, payload: object }
 *   - payload.data is an ArrayBuffer (RGBA, width*height*4) transferred zero-copy.
 *
 * Protocol (worker -> main):
 *   { id, ok: true,  result: ArrayBuffer, width, height }   (result transferred back)
 *   { id, ok: false, error: string }
 *
 * Add new ops in the switch below. Keep each op pure (no DOM).
 */
self.onmessage = function (e) {
  const { id, op, payload } = e.data || {};

  let result;
  try {
    switch (op) {
      case 'sharpen': {
        const { data, width, height } = payload;
        result = sharpen(data, width, height);
        break;
      }
      default:
        throw new Error('Unknown op: ' + op);
    }
    // result is an ArrayBuffer; transfer it back zero-copy.
    self.postMessage({ id, ok: true, result, width: payload.width, height: payload.height }, [result]);
  } catch (err) {
    self.postMessage({ id, ok: false, error: err && err.message ? err.message : String(err) });
  }
};

/**
 * 3x3 convolution sharpen (matches the historical kernel in the upscaler).
 * Border pixels are left untouched; alpha is preserved.
 * @param {ArrayBuffer} buffer RGBA pixel buffer
 * @param {number} width
 * @param {number} height
 * @returns {ArrayBuffer} new RGBA buffer
 */
function sharpen(buffer, width, height) {
  const src = new Uint8ClampedArray(buffer);
  const out = new Uint8ClampedArray(src); // copy: preserves border + alpha
  const w = width, h = height;

  // Unrolled 3x3 kernel [0,-1,0, -1,5,-1, 0,-1,0]
  for (let y = 1; y < h - 1; y++) {
    const rowTop = (y - 1) * w * 4;
    const rowMid = y * w * 4;
    const rowBot = (y + 1) * w * 4;
    for (let x = 1; x < w - 1; x++) {
      const i = x * 4;
      const r = -src[rowTop + i] - src[rowMid + i - 4] + 5 * src[rowMid + i] - src[rowMid + i + 4] - src[rowBot + i];
      const g = -src[rowTop + i + 1] - src[rowMid + i - 3] + 5 * src[rowMid + i + 1] - src[rowMid + i + 5] - src[rowBot + i + 1];
      const b = -src[rowTop + i + 2] - src[rowMid + i - 2] + 5 * src[rowMid + i + 2] - src[rowMid + i + 6] - src[rowBot + i + 2];
      out[rowMid + i] = r < 0 ? 0 : r > 255 ? 255 : r;
      out[rowMid + i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
      out[rowMid + i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
    }
  }

  return out.buffer;
}
