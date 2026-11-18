/**
 * Edge cleanup untuk hasil Remove Background.
 *
 * Model AI bekerja pada resolusi 1024px, jadi helai rambut tipis sering
 * menyisakan piksel semi-transparan yang masih membawa warna background asli
 * (halo / "background bocor"). Worker ini:
 *   1. membuang alpha sangat tipis (< 16) yang cuma jadi kabut background,
 *   2. mengganti warna piksel fringe dengan rata-rata tetangga yang opaque
 *      (despill 2 pass) supaya warna background tidak ikut terbawa.
 *
 * Semua kerja berat (decode, loop piksel, encode PNG) di OffscreenCanvas di
 * dalam worker — main thread tetap responsif untuk foto besar.
 */
const ALPHA_CUT = 16;
const OPAQUE = 245;
const DESPILL_PASSES = 2;

function cleanupPixels(data, width, height) {
  const total = width * height;

  // 1) Buang sisa background yang alpha-nya sangat tipis.
  for (let i = 0; i < total; i++) {
    const a = i * 4 + 3;
    if (data[a] < ALPHA_CUT) data[a] = 0;
  }

  // 2) Despill: piksel fringe mewarisi warna dari tetangga opaque terdekat.
  //    Alpha TIDAK diubah — helai rambut tetap halus, cuma warnanya bersih.
  let known = new Uint8Array(total);
  for (let i = 0; i < total; i++) {
    known[i] = data[i * 4 + 3] >= OPAQUE ? 1 : 0;
  }

  for (let pass = 0; pass < DESPILL_PASSES; pass++) {
    const next = known.slice();
    for (let y = 1; y < height - 1; y++) {
      let i = y * width + 1;
      for (let x = 1; x < width - 1; x++, i++) {
        if (known[i]) continue;
        const p = i * 4;
        if (data[p + 3] === 0) continue;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        // 8-neighborhood, unrolled supaya loop tetap cepat di foto 12MP.
        let j = i - width - 1;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j++;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j++;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j = i - 1;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j = i + 1;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j = i + width - 1;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j++;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }
        j++;
        if (known[j]) { r += data[j * 4]; g += data[j * 4 + 1]; b += data[j * 4 + 2]; count++; }

        if (count) {
          data[p] = r / count;
          data[p + 1] = g / count;
          data[p + 2] = b / count;
          next[i] = 1;
        }
      }
    }
    known = next;
  }
}

self.onmessage = async (event) => {
  const { id, blob } = event.data || {};
  try {
    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
      throw new Error('OffscreenCanvas tidak didukung');
    }

    const bitmap = await createImageBitmap(blob);
    const width = bitmap.width;
    const height = bitmap.height;
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D tidak tersedia');

    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const imageData = ctx.getImageData(0, 0, width, height);
    cleanupPixels(imageData.data, width, height);
    ctx.putImageData(imageData, 0, 0);

    const cleaned = await canvas.convertToBlob({ type: 'image/png' });
    self.postMessage({ id, ok: true, blob: cleaned });
  } catch (err) {
    self.postMessage({ id, ok: false, error: String((err && err.message) || err) });
  }
};
