import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePdfDropZone } from './usePdfDropZone';

function setup() {
  document.body.innerHTML = `
    <div id="dz"></div>
    <input type="file" id="fi" />
  `;
  const dz = document.getElementById('dz') as HTMLElement;
  const fi = document.getElementById('fi') as HTMLInputElement;
  return { dz, fi };
}

// jsdom doesn't implement the DataTransfer constructor, so we mock
// just the `files` array-like shape the composable reads from `e.dataTransfer`.
function makeDropEvent(files: File[]): Event {
  const event = new Event('drop', { bubbles: true }) as Event & { dataTransfer: { files: File[] } };
  Object.defineProperty(event, 'dataTransfer', { value: { files } });
  return event;
}

describe('usePdfDropZone', () => {
  beforeEach(() => {
    (window as any).showToast = vi.fn();
    (window as any)._tToast = (msg: string) => msg;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('configures the file input (multiple + accept)', () => {
    const { fi } = setup();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile: vi.fn(), multiple: true, accept: 'application/pdf' });
    expect(fi.multiple).toBe(true);
    expect(fi.accept).toBe('application/pdf');
  });

  it('opens the file picker when the dropzone is clicked', () => {
    const { dz, fi } = setup();
    const clickSpy = vi.spyOn(fi, 'click').mockImplementation(() => {});
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile: vi.fn() });
    dz.dispatchEvent(new MouseEvent('click'));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('adds accent classes on dragover and removes them on dragleave', () => {
    const { dz } = setup();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile: vi.fn() });
    dz.dispatchEvent(new Event('dragover'));
    expect(dz.classList.contains('border-red-500')).toBe(true);
    expect(dz.classList.contains('bg-red-50')).toBe(true);
    expect(dz.classList.contains('dark:bg-red-900/10')).toBe(true);
    dz.dispatchEvent(new Event('dragleave'));
    expect(dz.classList.contains('border-red-500')).toBe(false);
  });

  it('calls onFile with the dropped PDF file', () => {
    const { dz } = setup();
    const onFile = vi.fn();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile });
    const file = new File(['x'], 'test.pdf', { type: 'application/pdf' });
    dz.dispatchEvent(makeDropEvent([file]));
    expect(onFile).toHaveBeenCalledTimes(1);
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('calls onFile once per file when multiple is enabled', () => {
    const { dz } = setup();
    const onFile = vi.fn();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile, multiple: true });
    const a = new File(['a'], 'a.pdf', { type: 'application/pdf' });
    const b = new File(['b'], 'b.pdf', { type: 'application/pdf' });
    dz.dispatchEvent(makeDropEvent([a, b]));
    expect(onFile).toHaveBeenCalledTimes(2);
    expect(onFile).toHaveBeenCalledWith(a);
    expect(onFile).toHaveBeenCalledWith(b);
  });

  it('rejects a non-PDF file via onInvalid callback', () => {
    const { dz } = setup();
    const onInvalid = vi.fn();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile: vi.fn(), onInvalid });
    const file = new File(['x'], 'notes.txt', { type: 'text/plain' });
    dz.dispatchEvent(makeDropEvent([file]));
    expect(onInvalid).toHaveBeenCalledWith(file);
  });

  it('rejects oversized files with an error toast and skips onFile', () => {
    const { dz } = setup();
    const onFile = vi.fn();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile, maxSize: 10 });
    const file = new File([new ArrayBuffer(100)], 'big.pdf', { type: 'application/pdf' });
    dz.dispatchEvent(makeDropEvent([file]));
    expect(onFile).not.toHaveBeenCalled();
    expect((window as any).showToast).toHaveBeenCalledTimes(1);
    expect((window as any).showToast.mock.calls[0][1]).toBe('error');
  });

  it('processes files selected through the input change event', () => {
    const { fi } = setup();
    const onFile = vi.fn();
    usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile });
    const file = new File(['x'], 'picked.pdf', { type: 'application/pdf' });
    Object.defineProperty(fi, 'files', { value: [file], configurable: true });
    fi.dispatchEvent(new Event('change'));
    expect(onFile).toHaveBeenCalledWith(file);
  });

  it('returns a cleanup function that removes all listeners', () => {
    const { dz } = setup();
    const onFile = vi.fn();
    const cleanup = usePdfDropZone('dz', 'fi', { accentColor: 'red', onFile });
    cleanup();
    dz.dispatchEvent(new MouseEvent('click'));
    expect(onFile).not.toHaveBeenCalled();
  });

  it('warns and returns a no-op cleanup when elements are missing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const cleanup = usePdfDropZone('missing-zone', 'missing-input', { accentColor: 'red', onFile: vi.fn() });
    expect(warnSpy).toHaveBeenCalled();
    expect(typeof cleanup).toBe('function');
    cleanup(); // should not throw
    warnSpy.mockRestore();
  });
});
