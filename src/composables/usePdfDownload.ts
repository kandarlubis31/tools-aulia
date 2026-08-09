/**
 * Reusable download helpers — eliminates duplicated blob download boilerplate.
 *
 * @example
 * downloadBlob(pdfBlob, 'document.pdf');
 * downloadDataUrl(dataUrl, 'image.png');
 */

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Trigger a browser download for a Uint8Array (e.g., pdf-lib save result). */
export function downloadBytes(bytes: Uint8Array, filename: string, mimeType: string = 'application/pdf'): void {
  const blob = new Blob([bytes], { type: mimeType });
  downloadBlob(blob, filename);
}

/** Trigger a browser download for a data URL (e.g., canvas.toDataURL()). */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
