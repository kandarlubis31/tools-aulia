/**
 * Copy text to clipboard. Returns true if successful.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy text and show toast feedback.
 */
export async function copyWithToast(
  text: string,
  successMsg = 'Disalin!',
  errorMsg = 'Gagal menyalin'
): Promise<boolean> {
  const ok = await copyToClipboard(text);
  // window.showToast is attached by BaseLayout or useToast
  const show = (window as any).showToast || ((msg: string, type: string) => {});
  show(ok ? successMsg : errorMsg, ok ? 'success' : 'error');
  return ok;
}

/**
 * Copy an image (canvas) to clipboard.
 */
export async function copyImageToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
    if (!blob) return false;
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}
