/**
 * useOnline — deteksi koneksi NYATA, tahan false-positive `navigator.onLine`.
 *
 * `navigator.onLine` bisa melaporkan `false` padahal internet jalan (OS/VM/VPN,
 * adaptor tidur, handover wifi→4G). Sebaliknya event `offline` dari OS juga bisa
 * beruntun dan menimpa state yang baru saja benar (race). Karena itu:
 *   - `probeOnline()`  → verifikasi lewat fetch HEAD ke path yang tak di-precache
 *                        (`/__conncheck__`) — dapat respons apa pun (termasuk 404)
 *                        berarti online; reject/timeout berarti offline.
 *   - `verifyOffline()` → vonis offline hanya setelah DUA probe gagal berturut,
 *                         supaya satu kali probe gagal (jaringan sibuk / event
 *                         offline palsu) tak langsung jadi "Koneksi Terputus".
 *
 * Dipakai: jokes, motivation, brainstorm, my-ip. (BaseLayout & offline.astro pakai
 * versi inline sendiri karena `<script is:inline>` tidak bisa import modul.)
 */
export function probeOnline(timeoutMs = 3500): Promise<boolean> {
  // `true` boleh dipercaya cepat — false positif keluhan kita arah sebaliknya.
  if (typeof navigator !== 'undefined' && navigator.onLine) return Promise.resolve(true);
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: boolean) => { if (!done) { done = true; resolve(v); } };
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const to = setTimeout(() => { if (ctrl) ctrl.abort(); finish(false); }, timeoutMs);
    fetch('/__conncheck__?t=' + Date.now(), { method: 'HEAD', cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
      .then(() => { clearTimeout(to); finish(true); })
      .catch(() => { clearTimeout(to); finish(false); });
  });
}

/** true = benar-benar offline (probe gagal DUA kali, jeda `gapMs` antar probe). */
export async function verifyOffline(gapMs = 1500, timeoutMs = 3500): Promise<boolean> {
  if (await probeOnline(timeoutMs)) return false;
  await new Promise((r) => setTimeout(r, gapMs));
  return !(await probeOnline(timeoutMs));
}
