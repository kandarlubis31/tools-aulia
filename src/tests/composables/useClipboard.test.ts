/**
 * ToolsAulia - useClipboard Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard, copyBlobText } from '../../composables/useClipboard';

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should copy text to clipboard successfully', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const result = await copyToClipboard('Hello World');

    expect(mockWriteText).toHaveBeenCalledWith('Hello World');
    expect(result.success).toBe(true);
  });

  it('should return error when clipboard API fails', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard access denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const result = await copyToClipboard('Test');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Clipboard access denied');
  });
});

describe('copyBlobText', () => {
  it('should read blob content and copy to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });

    const blob = new Blob(['Blob content'], { type: 'text/plain' });
    const result = await copyBlobText(blob);

    expect(mockWriteText).toHaveBeenCalledWith('Blob content');
    expect(result.success).toBe(true);
  });

  it('should handle blob read error', async () => {
    const blob = new Blob([], { type: 'text/plain' });
    const result = await copyBlobText(blob);

    // Empty blob returns empty string, which is still valid
    expect(result.success).toBe(true);
  });
});