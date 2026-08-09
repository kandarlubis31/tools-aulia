/**
 * Reusable pdf.js PDF renderer helpers.
 * Eliminates duplicated pdf.js loading + page rendering boilerplate across 16 PDF tools.
 *
 * @example
 * const pdf = await loadPdf(arrayBuffer);
 * const canvas = await renderPageToCanvas(pdf, 1, 1.5);
 */

/** Load a PDF from an ArrayBuffer using pdf.js (must be loaded globally). */
export async function loadPdf(arrayBuffer: ArrayBuffer): Promise<PDFDocumentProxy> {
  if (!window.pdfjsLib) {
    throw new Error('pdf.js not loaded. Ensure BaseLayout has pdfJs={true} prop.');
  }
  return window.pdfjsLib.getDocument(arrayBuffer).promise;
}

/** Render a single PDF page to a canvas element. Returns the canvas. */
export async function renderPageToCanvas(
  page: PDFPageProxy,
  scale: number = 1.5,
  bgWhite: boolean = true
): Promise<HTMLCanvasElement> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D context not available');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // White background (good for JPEG output)
  if (bgWhite) {
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}

/** Render all pages of a PDF to canvases. Supports progress callback. */
export async function renderAllPagesToCanvases(
  pdf: PDFDocumentProxy,
  scale: number = 1.5,
  bgWhite: boolean = true,
  onProgress?: (current: number, total: number) => void
): Promise<HTMLCanvasElement[]> {
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const canvas = await renderPageToCanvas(page, scale, bgWhite);
    canvases.push(canvas);
    onProgress?.(i, pdf.numPages);
  }
  return canvases;
}

// Re-export types for consumer convenience
export type { PDFDocumentProxy, PDFPageProxy };
