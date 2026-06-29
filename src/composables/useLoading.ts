/**
 * Reusable loading spinner utilities.
 * Consistent loading UX across all tools.
 */

// Shared spinner SVG (Tailwind-compatible, inherits text color)
const SPINNER_SVG_SM = `<svg class="animate-spin h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
const SPINNER_SVG_MD = `<svg class="animate-spin h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;

export interface LoadingRestore {
  (): void;
}

/**
 * Replace button content with spinner + text.
 * Returns a function to restore the original button state.
 *
 * @example
 * const restore = showButtonSpinner(btn, 'Memproses...');
 * // ... async work ...
 * restore();
 */
export function showButtonSpinner(
  btn: HTMLButtonElement,
  text: string = 'Memproses...',
  size: 'sm' | 'md' = 'sm'
): LoadingRestore {
  const originalHTML = btn.innerHTML;
  const originalDisabled = btn.disabled;
  const spinner = size === 'md' ? SPINNER_SVG_MD : SPINNER_SVG_SM;
  btn.innerHTML = `${spinner} ${text}`;
  btn.disabled = true;
  btn.classList.add('opacity-75', 'cursor-not-allowed');
  return () => {
    btn.innerHTML = originalHTML;
    btn.disabled = originalDisabled;
    btn.classList.remove('opacity-75', 'cursor-not-allowed');
  };
}

/**
 * Quick inline spinner HTML string for use in template literals.
 * @example btn.innerHTML = \`${inlineSpinnerSm()} Memproses...\`;
 */
export function inlineSpinnerSm(): string {
  return SPINNER_SVG_SM;
}
export function inlineSpinnerMd(): string {
  return SPINNER_SVG_MD;
}
