/**
 * Reusable PDF drop zone — drag & drop + file input + validation.
 * Used by all PDF tools (~16 pages) to eliminate duplicated boilerplate.
 *
 * @example
 * const cleanup = usePdfDropZone('drop-zone', 'file-input', {
 *   accentColor: 'red',
 *   onFile: (file) => processPdf(file),
 * });
 * // On page leave: cleanup();
 */

export interface PdfDropZoneOptions {
  /** Tailwind color name for hover border/bg: 'red', 'orange', 'emerald', 'blue', etc. */
  accentColor: string;
  /** Called when a valid file is selected. Async supported. */
  onFile: (file: File) => void | Promise<void>;
  /** Accept multiple files? Default false. */
  multiple?: boolean;
  /** Custom accept attribute. Default 'application/pdf'. */
  accept?: string;
  /** Called when an invalid file is dropped/selected. Default: shows toast. */
  onInvalid?: (file: File) => void;
}

const INVALID_MAP: Record<string, string> = {
  'application/pdf': 'Mohon upload file PDF!',
};

export function usePdfDropZone(
  dropZoneId: string,
  fileInputId: string,
  options: PdfDropZoneOptions
): () => void {
  const { accentColor, onFile, multiple = false, accept = 'application/pdf', onInvalid } = options;

  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement | null;

  if (!dropZone || !fileInput) {
    console.warn(`usePdfDropZone: elements "#${dropZoneId}" or "#${fileInputId}" not found`);
    return () => {};
  }

  // Setup file input
  if (multiple) fileInput.multiple = true;
  if (accept) fileInput.accept = accept;

  // Color classes derived from accentColor
  const borderClass = `border-${accentColor}-500`;
  const bgLightClass = `bg-${accentColor}-50`;
  const bgDarkClass = `dark:bg-${accentColor}-900/10`;

  // Click handler
  const onClick = () => fileInput.click();

  // Drag handlers
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    dropZone.classList.add(borderClass, bgLightClass, bgDarkClass);
  };

  const onDragLeave = () => {
    dropZone.classList.remove(borderClass, bgLightClass, bgDarkClass);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    dropZone.classList.remove(borderClass, bgLightClass, bgDarkClass);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    processFiles(Array.from(files));
  };

  // File input change
  const onInputChange = () => {
    if (fileInput.files && fileInput.files.length > 0) {
      processFiles(Array.from(fileInput.files));
    }
  };

  function processFiles(files: File[]) {
    const validFiles: File[] = [];
    for (const file of files) {
      if (accept && !file.type.match(accept.replace('*', '.*').replace('/', '\\/'))) {
        if (onInvalid) {
          onInvalid(file);
        } else {
          const msg = INVALID_MAP[accept] || `File tidak valid! Harap upload file ${accept}.`;
          window.showToast?.(window._tToast ? window._tToast(msg) : msg, 'error');
        }
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (multiple) {
      for (const file of validFiles) {
        onFile(file);
      }
    } else {
      onFile(validFiles[0]);
    }
  }

  // Attach listeners
  dropZone.addEventListener('click', onClick);
  dropZone.addEventListener('dragover', onDragOver);
  dropZone.addEventListener('dragleave', onDragLeave);
  dropZone.addEventListener('drop', onDrop);
  fileInput.addEventListener('change', onInputChange);

  // Return cleanup function
  return () => {
    dropZone.removeEventListener('click', onClick);
    dropZone.removeEventListener('dragover', onDragOver);
    dropZone.removeEventListener('dragleave', onDragLeave);
    dropZone.removeEventListener('drop', onDrop);
    fileInput.removeEventListener('change', onInputChange);
  };
}
