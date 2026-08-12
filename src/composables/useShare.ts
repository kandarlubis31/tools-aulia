/**
 * Reusable share handler — generic text/link sharing with Web Share API fallback.
 * Used by jokes, brainstorm, motivation pages, and the global ToolPageHeader share button.
 * When `url` is provided it's shared via navigator.share and copied as fallback (E2).
 */
export async function shareContent(
  text: string,
  title: string = 'Coba ini!',
  successMsg: string = 'Teks disalin ke clipboard!',
  errorMsg: string = 'Gagal membagikan!',
  url?: string,
) {
  const shareData: ShareData = { title, text, ...(url ? { url } : {}) };
  const copyFallback = () => navigator.clipboard.writeText(url ?? text);

  const toastResult = (ok: boolean) => {
    window.showToast?.(
      window._tToast ? window._tToast(ok ? successMsg : errorMsg) : (ok ? successMsg : errorMsg),
      ok ? 'success' : 'error',
    );
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // AbortError = user dismissed dialog — not an error
      if ((err as Error).name !== 'AbortError') {
        toastResult(await copyFallback().then(() => true).catch(() => false));
      }
    }
  } else {
    toastResult(await copyFallback().then(() => true).catch(() => false));
  }
}

/**
 * Share with custom action (e.g. copy to clipboard only, no Web Share).
 */
export async function copyShare(
  text: string,
  successMsg: string = 'Teks disalin!',
) {
  try {
    await navigator.clipboard.writeText(text);
    window.showToast?.(
      window._tToast ? window._tToast(successMsg) : successMsg,
      'success',
    );
  } catch {
    window.showToast?.(
      window._tToast ? window._tToast('Gagal menyalin teks') : 'Gagal menyalin teks',
      'error',
    );
  }
}
