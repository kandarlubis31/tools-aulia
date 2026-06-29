import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should return true when clipboard API succeeds', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('some text');
      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('some text');
    });

    it('should return false when clipboard API fails', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'));
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('some text');
      expect(result).toBe(false);
    });

    it('should return false when clipboard is not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = await copyToClipboard('some text');
      expect(result).toBe(false);
    });
  });
});
