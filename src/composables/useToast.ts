/**
 * ToolsAulia - Toast Composable
 * Consistent toast notification system across all tool pages
 */

import type { ToastType, ToastOptions } from '../types/tool';

declare global {
  interface Window {
    showToast: (message: string, type?: ToastType) => void;
    _tToast: ((key: string) => string) | null;
  }
}

// Timeout registry to prevent memory leaks from accumulated timers
const toastTimeouts = new Map<Element, ReturnType<typeof setTimeout>>();

/**
 * Clean up toast timeouts when element is removed
 */
function cleanupToastTimeout(toast: Element) {
  if (toastTimeouts.has(toast)) {
    clearTimeout(toastTimeouts.get(toast));
    toastTimeouts.delete(toast);
  }
}

/**
 * Creates a toast notification with translation support
 */
export function useToast() {
  const show = (options: ToastOptions | string, defaultType: ToastType = 'success') => {
    // Support both signatures:
    // - show(message, type) - legacy
    // - show({ message, type, duration }) - new
    let message: string;
    let duration: number;
    let type: ToastType;
    
    if (typeof options === 'string') {
      // Legacy: show(message, type)
      message = options;
      duration = 3000;
      type = defaultType;
    } else {
      // New: show({ message, type, duration })
      message = options.message;
      duration = options.duration || 3000;
      type = options.type || defaultType;
    }

    // Use translation function if available
    const translatedMessage = window._tToast ? window._tToast(message) : message;

    if (typeof window.showToast === 'function') {
      window.showToast(translatedMessage, type);
    } else {
      // Fallback to console
      console.log(`[${type.toUpperCase()}] ${translatedMessage}`);
    }

    // Auto-hide after duration with proper cleanup
    const toastContainer = document.querySelector('#toast-container');
    if (toastContainer) {
      const lastToast = toastContainer.lastElementChild;
      if (lastToast) {
        // Clear any existing timeout for this toast
        cleanupToastTimeout(lastToast);
        
        const timeoutId = setTimeout(() => {
          lastToast.classList.add('translate-y-full', 'opacity-0');
          setTimeout(() => {
            lastToast.remove();
            toastTimeouts.delete(lastToast);
          }, 300);
        }, duration);
        
        toastTimeouts.set(lastToast, timeoutId);
      }
    }
  };

  const success = (message: string, options?: Partial<ToastOptions>) => {
    show({ message, type: 'success', ...options });
  };

  const error = (message: string, options?: Partial<ToastOptions>) => {
    show({ message, type: 'error', ...options });
  };

  const warning = (message: string, options?: Partial<ToastOptions>) => {
    show({ message, type: 'warning', ...options });
  };

  const info = (message: string, options?: Partial<ToastOptions>) => {
    show({ message, type: 'info', ...options });
  };

  /**
   * Clean up all toast timers - call when component unmounts
   */
  const destroy = () => {
    toastTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    toastTimeouts.clear();
  };

  return {
    show,
    success,
    error,
    warning,
    info,
    destroy,
  };
}

/**
 * Translation-aware toast key handler
 * Use this for toast messages that need i18n
 */
export function useToastKey() {
  const showKey = (key: string, type: ToastType = 'success') => {
    if (typeof window.showToast === 'function') {
      const message = window._tToast ? window._tToast(key) : key;
      window.showToast(message, type);
    }
  };

  return {
    showKey,
    success: (key: string) => showKey(key, 'success'),
    error: (key: string) => showKey(key, 'error'),
    warning: (key: string) => showKey(key, 'warning'),
    info: (key: string) => showKey(key, 'info'),
  };
}