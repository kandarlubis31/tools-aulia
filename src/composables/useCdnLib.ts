/**
 * Wait for a CDN-loaded global library with retries.
 * Used by html-to-pdf (html2pdf) and html-to-img (html2canvas).
 *
 * Registered globally on `window.waitForCdnLib` via BaseLayout, so pages
 * call it directly: `const ready = await window.waitForCdnLib('html2pdf')`.
 *
 * @example
 * const ready = await waitForCdnLib('html2pdf');
 * if (!ready) return showToast('Library gagal dimuat', 'error');
 */

export interface CdnLibOptions {
  /** Maximum retry attempts. Default 30 (~3 seconds at 100ms interval). */
  maxRetries?: number;
  /** Retry interval in ms. Default 100. */
  interval?: number;
}

export function waitForCdnLib(
  libName: string,
  options: CdnLibOptions = {}
): Promise<boolean> {
  const { maxRetries = 30, interval = 100 } = options;

  return new Promise((resolve) => {
    let attempts = 0;

    function check() {
      if (typeof (window as any)[libName] !== 'undefined') {
        resolve(true);
        return;
      }
      if (++attempts >= maxRetries) {
        resolve(false);
        return;
      }
      setTimeout(check, interval);
    }

    check();
  });
}

/**
 * Inject satu <script> ke <head>. Resolve true kalau onload, false kalau onerror
 * ATAU timeout (CDN hang — onerror tidak pernah fire). Script gagal dibuang
 * biar gak nyangkut di DOM.
 */
function loadScript(url: string, timeoutMs = 15000): Promise<boolean> {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    const done = (ok: boolean) => {
      clearTimeout(timer);
      if (!ok && s.parentNode) s.remove();
      resolve(ok);
    };
    const timer = setTimeout(() => done(false), timeoutMs);
    s.src = url;
    s.onload = () => done(true);
    s.onerror = () => done(false);
    document.head.appendChild(s);
  });
}

/**
 * Load library CDN dengan fallback berantai — pola yang sama dengan fallback
 * qrious: kalau CDN utama gagal/blokir (404, network, ad-blocker), otomatis coba
 * CDN cadangan sampai ada yang berhasil. Dipakai untuk library besar yang
 * sengaja TIDAK di-vendor (xlsx, pptxgenjs, html2pdf, leaflet) supaya precache
 * SW tetap ringan.
 *
 * @param libName nama global yang dicek (mis. 'XLSX', 'PptxGenJS', 'L')
 * @param urls daftar URL CDN yang dicoba berurutan
 * @returns true kalau global siap, false kalau semua CDN gagal
 */
export async function loadCdnLib(
  libName: string,
  urls: string[],
  options: CdnLibOptions = {}
): Promise<boolean> {
  const { maxRetries = 30, interval = 100 } = options;
  if (typeof (window as any)[libName] !== 'undefined') return true;

  for (const url of urls) {
    if (typeof (window as any)[libName] !== 'undefined') return true;
    const ok = await loadScript(url);
    if (ok && typeof (window as any)[libName] !== 'undefined') return true;
  }

  // Last resort: poll — beberapa lib set global async setelah onload.
  for (let i = 0; i < maxRetries; i++) {
    if (typeof (window as any)[libName] !== 'undefined') return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return typeof (window as any)[libName] !== 'undefined';
}
