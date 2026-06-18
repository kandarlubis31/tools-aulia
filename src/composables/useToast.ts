export type ToastType = 'success' | 'error' | 'info' | 'warning';

const COLOR_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-amber-500 text-white',
};

/**
 * Show a toast notification. Auto-translates via window._tToast if available.
 */
export function showToast(message: string, type: ToastType = 'success', durationMs = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-x-10 opacity-0 min-w-[300px] backdrop-blur-sm ${COLOR_MAP[type]}`;

  const msg = typeof window._tToast === 'function' ? window._tToast(message) : message;
  toast.innerHTML = `<span class="font-bold text-sm">${msg}</span>`;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-x-10', 'opacity-0'));

  setTimeout(() => {
    toast.classList.add('translate-x-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, durationMs);
}
