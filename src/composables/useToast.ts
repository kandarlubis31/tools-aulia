export type ToastType = 'success' | 'error' | 'info' | 'warning';

const COLOR_MAP: Record<ToastType, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-amber-500 text-white',
};

const ICON_MAP: Record<ToastType, string> = {
  success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
};

const MAX_TOASTS = 3;

/**
 * Show a toast notification. Auto-translates via window._tToast if available.
 * Upgraded: icon per type, role=status (a11y), stack capped at MAX_TOASTS.
 */
export function showToast(message: string, type: ToastType = 'success', durationMs = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  // Stack: buang toast tertua kalau sudah lebih dari MAX_TOASTS
  while (container.children.length >= MAX_TOASTS) {
    container.firstElementChild?.remove();
  }

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transform transition-all duration-300 translate-x-10 opacity-0 min-w-[300px] backdrop-blur-sm ${COLOR_MAP[type]}`;
  toast.setAttribute('role', 'status');

  const msg = typeof window._tToast === 'function' ? window._tToast(message) : message;
  // Ikon via innerHTML (static), pesan via textContent (XSS-safe — message bisa berisi input user seperti file.name)
  toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0">${ICON_MAP[type]}</svg>`;
  const msgSpan = document.createElement('span');
  msgSpan.className = 'font-bold text-sm leading-snug';
  msgSpan.textContent = msg;
  toast.appendChild(msgSpan);

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-x-10', 'opacity-0'));

  setTimeout(() => {
    toast.classList.add('translate-x-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, durationMs);
}
