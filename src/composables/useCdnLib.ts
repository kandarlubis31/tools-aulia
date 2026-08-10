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
