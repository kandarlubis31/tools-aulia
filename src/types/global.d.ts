// Global window type declarations for ToolsAulia

declare global {
  interface Window {
    /** i18n translate function — returns translated string or falls back to ID */
    _tToast?: (key: string) => string;
    /** i18n translate shorthand */
    _t?: (key: string) => string;
    /** Show toast notification: (message: string, type?: 'success' | 'error' | 'info') => void */
    showToast?: (message: string, type?: string) => void;
    /** Show button loading spinner — returns restore function */
    showButtonSpinner?: (btn: HTMLElement, text?: string) => () => void;
    /** Keyboard shortcuts registered flag */
    _shortcutsRegistered?: boolean;
    /** PWA deferred install prompt */
    _pwaDeferredPrompt?: { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null;
    /** pdf.js library (loaded from CDN) */
    pdfjsLib?: {
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (data: ArrayBuffer | string | { url: string }) => {
        promise: Promise<PDFDocumentProxy>;
      };
    };
    /** i18n object (loaded from i18n-phrases.js) */
    i18n?: {
      t: (key: string, fallback?: string) => string;
    };
    /** html2canvas (loaded from CDN) */
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    /** PptxGenJS (loaded from CDN) */
    PptxGenJS?: new () => {
      layout: string;
      addSlide: () => { background: { data: string } };
      writeFile: (options: { fileName: string }) => Promise<void>;
    };
    /** pdf-lib (loaded from CDN) */
    PDFLib?: {
      PDFDocument: unknown;
      rgb: (r: number, g: number, b: number) => unknown;
      StandardFonts: Record<string, unknown>;
      degrees: (deg: number) => unknown;
    };
    /** CryptoJS (loaded from CDN) */
    CryptoJS?: {
      MD5: (val: string) => { toString: () => string };
      SHA1: (val: string) => { toString: () => string };
      SHA256: (val: string) => { toString: () => string };
      SHA512: (val: string) => { toString: () => string };
    };
    /** Webkit audio context for older browsers */
    webkitAudioContext?: typeof AudioContext;
    /** cronstrue (loaded from CDN) */
    cronstrue?: { toString: (val: string, options: { locale: string }) => string };
    /** luxon (loaded from CDN) */
    luxon?: { DateTime: { now: () => { setZone: (zone: string) => { toFormat: (fmt: string) => string } } } };
    /** jsdiff (loaded from CDN) */
    JsDiff?: { diffWords: (a: string, b: string) => Array<{ added?: boolean; removed?: boolean; value: string }> };
    /** QRious (loaded from CDN) */
    QRious?: new (options: Record<string, unknown>) => { toDataURL: () => string };
    /** Interval IDs for SPA cleanup (prabowo-countdown) */
    _staleIntervals?: number[];
    /** usePdfDropZone — reusable PDF drop zone (src/composables/usePdfDropZone.ts) */
    usePdfDropZone?: typeof import('../composables/usePdfDropZone').usePdfDropZone;
    /** usePdfRenderer helpers (src/composables/usePdfRenderer.ts) */
    loadPdf?: typeof import('../composables/usePdfRenderer').loadPdf;
    renderPageToCanvas?: typeof import('../composables/usePdfRenderer').renderPageToCanvas;
    renderAllPagesToCanvases?: typeof import('../composables/usePdfRenderer').renderAllPagesToCanvases;
    /** usePdfDownload helpers (src/composables/usePdfDownload.ts) */
    downloadBlob?: typeof import('../composables/usePdfDownload').downloadBlob;
    downloadBytes?: typeof import('../composables/usePdfDownload').downloadBytes;
    /** useCdnLib — wait for a CDN-loaded global lib with retries (src/composables/useCdnLib.ts) */
    waitForCdnLib?: (libName: string, options?: { maxRetries?: number; interval?: number }) => Promise<boolean>;
  }

  // pdf.js types
  interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNum: number) => Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getViewport: (options: { scale: number }) => { width: number; height: number };
    render: (params: { canvasContext: CanvasRenderingContext2D | null; viewport: { width: number; height: number } }) => { promise: Promise<void> };
  }
}

export {};
