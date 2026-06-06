/**
 * ToolsAulia - Clipboard Composable
 * Consistent clipboard operations across all tool pages
 */

import type { ClipboardResult } from '../types/tool';
import { useToast } from './useToast';

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  const toast = useToast();

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      toast.success('msg.copied');
      return { success: true, message: 'Copied to clipboard' };
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      toast.success('msg.copied');
      return { success: true, message: 'Copied to clipboard' };
    }

    throw new Error('Copy command failed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to copy';
    toast.error('msg.copy_failed');
    return { success: false, message };
  }
}

/**
 * Copy text content from a Blob to clipboard
 */
export async function copyBlobText(blob: Blob): Promise<ClipboardResult> {
  try {
    const text = await blob.text();
    return copyToClipboard(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to read blob';
    return { success: false, message };
  }
}