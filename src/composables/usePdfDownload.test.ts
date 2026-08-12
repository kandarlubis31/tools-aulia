import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadBlob, downloadBytes, downloadDataUrl } from './usePdfDownload';

describe('download helpers', () => {
  let createSpy: ReturnType<typeof vi.spyOn>;
  let revokeSpy: ReturnType<typeof vi.spyOn>;
  let appendSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let appended: HTMLAnchorElement | null = null;

  beforeEach(() => {
    appended = null;
    createSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-url');
    revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node: any) => {
      appended = node as HTMLAnchorElement;
      return node;
    });
    removeSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node: any) => node);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('downloadBlob creates an object URL, clicks the anchor, and revokes it', () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    downloadBlob(blob, 'file.txt');

    expect(createSpy).toHaveBeenCalledWith(blob);
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalledWith('blob:fake-url');
    expect(appended?.download).toBe('file.txt');
    expect(appended?.href).toBe('blob:fake-url');
    expect(removeSpy).toHaveBeenCalledWith(appended);
  });

  it('downloadBytes wraps bytes in a Blob with the given mime type', () => {
    const bytes = new Uint8Array([1, 2, 3]);
    downloadBytes(bytes, 'doc.pdf', 'application/pdf');

    const blobArg = createSpy.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('application/pdf');
    expect(appended?.download).toBe('doc.pdf');
  });

  it('downloadBytes defaults to application/pdf mime type', () => {
    downloadBytes(new Uint8Array([1]), 'default.pdf');
    const blobArg = createSpy.mock.calls[0][0] as Blob;
    expect(blobArg.type).toBe('application/pdf');
  });

  it('downloadDataUrl sets the anchor href directly (no object URL involved)', () => {
    downloadDataUrl('data:image/png;base64,AAAA', 'image.png');

    expect(createSpy).not.toHaveBeenCalled();
    expect(appended?.download).toBe('image.png');
    expect(appended?.href).toBe('data:image/png;base64,AAAA');
    expect(clickSpy).toHaveBeenCalled();
  });
});
