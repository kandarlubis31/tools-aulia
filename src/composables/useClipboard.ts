/**
 * Copy plain text to clipboard. Returns true if successful.
 * Simple, fast — uses navigator.clipboard.writeText.
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
 * Copy rich content (plain text + HTML) to clipboard using a 3-tier fallback:
 *   1. execCommand('copy') — gold standard, writes BOTH text/html + text/plain synchronously
 *   2. ClipboardItem API — modern, supports custom MIME types (text/markdown, etc.)
 *   3. writeText() — plain text last resort
 *
 * Optionally include a text/markdown MIME type so markdown-aware apps
 * (Obsidian, VS Code, etc.) detect it as markdown content.
 */
export async function copyRichText(
  plainText: string,
  htmlContent: string,
  markdownText?: string,
): Promise<boolean> {
  // ── Tier 1: execCommand('copy') with hidden contenteditable div ──
  // Browser auto-writes both text/html (from innerHTML) and text/plain (from innerText)
  try {
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = 'true';
    tempDiv.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;z-index:-1000';
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    const ok = document.execCommand('copy');

    selection?.removeAllRanges();
    document.body.removeChild(tempDiv);

    if (ok) return true;
  } catch {
    // fall through
  }

  // ── Tier 2: ClipboardItem API (modern, HTTPS + user activation required) ──
  try {
    const items: Record<string, Blob> = {
      'text/plain': new Blob([plainText], { type: 'text/plain' }),
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
    };
    if (markdownText) {
      items['text/markdown'] = new Blob([markdownText], { type: 'text/markdown;charset=utf-8' });
      items['text/x-markdown'] = new Blob([markdownText], { type: 'text/x-markdown;charset=utf-8' });
    }
    const clipboardItem = new ClipboardItem(items);
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch {
    // fall through
  }

  // ── Tier 3: Plain text fallback ──
  try {
    await navigator.clipboard.writeText(plainText);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy text and show toast feedback via window.showToast.
 */
export async function copyWithToast(
  text: string,
  successMsg = 'Disalin!',
  errorMsg = 'Gagal menyalin',
): Promise<boolean> {
  const ok = await copyToClipboard(text);
  const show = (window as any).showToast || ((_msg: string, _type: string) => {});
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
