import { describe, it, expect, beforeEach } from 'vitest';
import { showButtonSpinner, inlineSpinnerSm, inlineSpinnerMd } from './useLoading';

describe('useLoading', () => {
  let btn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    btn = document.createElement('button');
    btn.innerHTML = 'Click Me';
    document.body.appendChild(btn);
  });

  describe('showButtonSpinner', () => {
    it('should replace button content with spinner and text', () => {
      const restore = showButtonSpinner(btn, 'Memproses...');
      expect(btn.innerHTML).toContain('animate-spin');
      expect(btn.innerHTML).toContain('Memproses...');
      expect(btn.disabled).toBe(true);
      expect(btn.classList.contains('opacity-75')).toBe(true);
      expect(btn.classList.contains('cursor-not-allowed')).toBe(true);
      restore(); // cleanup
    });

    it('should restore original button state when called', () => {
      const originalHTML = btn.innerHTML;
      const wasDisabled = btn.disabled;

      const restore = showButtonSpinner(btn, 'Loading...');
      restore();

      expect(btn.innerHTML).toBe(originalHTML);
      expect(btn.disabled).toBe(wasDisabled);
      expect(btn.classList.contains('opacity-75')).toBe(false);
      expect(btn.classList.contains('cursor-not-allowed')).toBe(false);
    });

    it('should use default text "Memproses..." when no text provided', () => {
      const restore = showButtonSpinner(btn);
      expect(btn.innerHTML).toContain('Memproses...');
      restore();
    });

    it('should use md spinner when size is md', () => {
      const restore = showButtonSpinner(btn, 'Loading', 'md');
      expect(btn.innerHTML).toContain('h-5 w-5');
      expect(btn.innerHTML).not.toContain('h-4 w-4');
      restore();
    });

    it('should use sm spinner by default', () => {
      const restore = showButtonSpinner(btn);
      expect(btn.innerHTML).toContain('h-4 w-4');
      restore();
    });

    it('should preserve original disabled=false state on restore', () => {
      btn.disabled = false;
      const restore = showButtonSpinner(btn, 'Working...');
      expect(btn.disabled).toBe(true);
      restore();
      expect(btn.disabled).toBe(false);
    });

    it('should preserve original disabled=true state on restore', () => {
      btn.disabled = true;
      const restore = showButtonSpinner(btn, 'Working...');
      expect(btn.disabled).toBe(true);
      restore();
      expect(btn.disabled).toBe(true);
    });
  });

  describe('inlineSpinnerSm', () => {
    it('should return an SVG string', () => {
      const result = inlineSpinnerSm();
      expect(result).toContain('<svg');
      expect(result).toContain('animate-spin');
      expect(result).toContain('h-4 w-4');
    });
  });

  describe('inlineSpinnerMd', () => {
    it('should return an SVG string', () => {
      const result = inlineSpinnerMd();
      expect(result).toContain('<svg');
      expect(result).toContain('animate-spin');
      expect(result).toContain('h-5 w-5');
    });
  });
});
