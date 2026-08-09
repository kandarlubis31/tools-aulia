import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { shareContent, copyShare } from './useShare';

describe('useShare', () => {
  let originalNavigator: any;

  beforeEach(() => {
    originalNavigator = { ...globalThis.navigator };
    // Reset mocks
    vi.restoreAllMocks();

    // Mock showToast
    (window as any).showToast = vi.fn();
    (window as any)._tToast = (msg: string) => msg;
  });

  afterEach(() => {
    // Restore navigator
    Object.defineProperty(globalThis, 'navigator', {
      value: originalNavigator,
      configurable: true,
      writable: true,
    });
  });

  describe('shareContent', () => {
    it('should use navigator.share when available', async () => {
      const shareMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: shareMock },
        configurable: true,
      });

      await shareContent('Hello world', 'Test', 'Disalin!', 'Gagal!');

      expect(shareMock).toHaveBeenCalledWith({
        title: 'Test',
        text: 'Hello world',
      });
    });

    it('should fallback to clipboard when share fails (not AbortError)', async () => {
      const shareMock = vi.fn().mockRejectedValue(new Error('Network error'));
      const clipboardMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: shareMock,
          clipboard: { writeText: clipboardMock },
        },
        configurable: true,
      });

      await shareContent('Hello', 'Test', 'Disalin!', 'Gagal!');

      expect(clipboardMock).toHaveBeenCalledWith('Hello');
      expect((window as any).showToast).toHaveBeenCalledWith('Disalin!', 'success');
    });

    it('should not show toast on AbortError (user dismissed)', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      const shareMock = vi.fn().mockRejectedValue(abortError);
      Object.defineProperty(globalThis, 'navigator', {
        value: { share: shareMock },
        configurable: true,
      });

      await shareContent('Hello', 'Test', 'Disalin!', 'Gagal!');

      expect((window as any).showToast).not.toHaveBeenCalled();
    });

    it('should use clipboard fallback when navigator.share is not available', async () => {
      const clipboardMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: undefined,
          clipboard: { writeText: clipboardMock },
        },
        configurable: true,
      });

      await shareContent('Hello', 'Test', 'Disalin!', 'Gagal!');

      expect(clipboardMock).toHaveBeenCalledWith('Hello');
      expect((window as any).showToast).toHaveBeenCalledWith('Disalin!', 'success');
    });

    it('should show error toast when clipboard also fails', async () => {
      const clipboardMock = vi.fn().mockRejectedValue(new Error('Denied'));
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: undefined,
          clipboard: { writeText: clipboardMock },
        },
        configurable: true,
      });

      await shareContent('Hello', 'Test', 'Disalin!', 'Gagal!');

      expect((window as any).showToast).toHaveBeenCalledWith('Gagal!', 'error');
    });

    it('should translate messages via _tToast when available', async () => {
      (window as any)._tToast = (msg: string) =>
        msg === 'Disalin!' ? 'Copied!' : msg;

      const clipboardMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: {
          share: undefined,
          clipboard: { writeText: clipboardMock },
        },
        configurable: true,
      });

      await shareContent('Hello', 'Test', 'Disalin!', 'Gagal!');

      expect((window as any).showToast).toHaveBeenCalledWith('Copied!', 'success');
    });
  });

  describe('copyShare', () => {
    it('should copy text to clipboard and show success toast', async () => {
      const clipboardMock = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(globalThis, 'navigator', {
        value: { clipboard: { writeText: clipboardMock } },
        configurable: true,
      });

      await copyShare('Hello world');

      expect(clipboardMock).toHaveBeenCalledWith('Hello world');
      expect((window as any).showToast).toHaveBeenCalledWith(
        'Teks disalin!',
        'success',
      );
    });

    it('should show error toast when clipboard fails', async () => {
      const clipboardMock = vi.fn().mockRejectedValue(new Error('Denied'));
      Object.defineProperty(globalThis, 'navigator', {
        value: { clipboard: { writeText: clipboardMock } },
        configurable: true,
      });

      await copyShare('Hello');

      expect((window as any).showToast).toHaveBeenCalledWith(
        'Gagal menyalin teks',
        'error',
      );
    });
  });
});
