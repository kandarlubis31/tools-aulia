/**
 * ToolsAulia - File Handler Composable
 * Consistent file handling with drag & drop across all tool pages
 */

import type { FileHandlerOptions, DropZoneHandlers } from '../types/tool';

export function useFileHandler(options: FileHandlerOptions) {
  const {
    accept,
    multiple = false,
    maxSize,
    onFilesSelected,
    onError,
  } = options;

  /**
   * Creates a drop zone handler with visual feedback
   */
  function createDropZone(
    dropZone: HTMLElement | null,
    fileInput: HTMLInputElement | null,
    handlers?: DropZoneHandlers
  ) {
    if (!dropZone || !fileInput) return;

    // Click to open file dialog
    dropZone.addEventListener('click', () => fileInput.click());

    // File input change handler
    fileInput.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFiles(Array.from(target.files));
      }
    });

    // Drag over - visual feedback
    dropZone.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handlers?.onDragOver?.(e);
      dropZone.classList.add('border-primary-500', 'bg-primary-50/20', 'dark:bg-primary-900/10');
    });

    // Drag leave - remove visual feedback
    dropZone.addEventListener('dragleave', (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handlers?.onDragLeave?.(e);
      dropZone.classList.remove('border-primary-500', 'bg-primary-50/20', 'dark:bg-primary-900/10');
    });

    // Drop handler
    dropZone.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-primary-500', 'bg-primary-50/20', 'dark:bg-primary-900/10');

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        handlers?.onDrop?.(e, files);
        handleFiles(files);
      }
    });
  }

  function handleFiles(files: File[]) {
    // Filter by accepted types
    const acceptTypes = Array.isArray(accept) ? accept : accept.split(',').map(t => t.trim());
    const validFiles = files.filter(file => {
      const isValidType = acceptTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type);
        }
        if (type.includes('/*')) {
          return file.type.match(new RegExp(type.replace('/*', '/*')));
        }
        return file.type === type;
      });

      if (!isValidType) {
        onError?.(`File "${file.name}" is not a valid format. Allowed: ${acceptTypes.join(', ')}`);
        return false;
      }

      if (maxSize && file.size > maxSize) {
        onError?.(`File "${file.name}" is too large. Maximum size: ${formatFileSize(maxSize)}`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      onFilesSelected?.(multiple ? validFiles : [validFiles[0]]);
    }
  }

  return {
    createDropZone,
    handleFiles,
  };
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(1) + ' GB';
}

/**
 * Validate file is a PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}