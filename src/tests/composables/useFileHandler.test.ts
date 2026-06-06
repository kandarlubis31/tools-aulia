/**
 * ToolsAulia - useFileHandler Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatFileSize, isPDF } from '../../composables/useFileHandler';

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(5242880)).toBe('5.0 MB');
  });

  it('should format gigabytes correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });
});

describe('isPDF', () => {
  it('should return true for PDF mime type', () => {
    const file = new File([], 'test.pdf', { type: 'application/pdf' });
    expect(isPDF(file)).toBe(true);
  });

  it('should return true for PDF extension', () => {
    const file = new File([], 'test.PDF', { type: 'application/octet-stream' });
    expect(isPDF(file)).toBe(true);
  });

  it('should return false for non-PDF files', () => {
    const file = new File([], 'test.jpg', { type: 'image/jpeg' });
    expect(isPDF(file)).toBe(false);
  });

  it('should return false for text files', () => {
    const file = new File([], 'test.txt', { type: 'text/plain' });
    expect(isPDF(file)).toBe(false);
  });
});