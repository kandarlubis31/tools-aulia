/**
 * Reusable share handler — generic text sharing with Web Share API fallback.
 * Used by jokes, brainstorm, and motivation pages (previously copy-pasted).
 */
export async function shareContent(
  text: string,
  title: string = 'Coba ini!',
  successMsg: string = 'Teks disalin ke clipboard!',
  errorMsg: string = 'Gagal membagikan.',
) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
    } catch (err) {
      // AbortError = user dismissed dialog — not an error
      if ((err as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(text);
        window.showToast?.(
          window._tToast ? window._tToast(successMsg) : successMsg,
          'success',
        );
      }
    }
  } else {
    const ok = await navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    window.showToast?.(
      window._tToast ? window._tToast(ok ? successMsg : errorMsg) : (ok ? successMsg : errorMsg),
      ok ? 'success' : 'error',
    );
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
