import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { showToast, type ToastType } from './useToast';

function createContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);
  return container;
}

describe('useToast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create a toast element inside #toast-container', () => {
    createContainer();
    showToast('Hello world');
    const container = document.getElementById('toast-container')!;
    expect(container.children.length).toBe(1);
    expect(container.children[0].textContent).toContain('Hello world');
  });

  it('should do nothing when #toast-container is missing', () => {
    showToast('Hello world');
    // No container, should not throw
    expect(document.querySelector('#toast-container')).toBeNull();
  });

  it('should apply correct color class for each type', () => {
    createContainer();
    const types: ToastType[] = ['success', 'error', 'info', 'warning'];
    const expectedClasses = ['bg-emerald-500', 'bg-rose-500', 'bg-blue-500', 'bg-amber-500'];

    types.forEach((type, i) => {
      document.body.innerHTML = '';
      createContainer();
      showToast('msg', type);
      const toast = document.querySelector('#toast-container')!.children[0];
      expect(toast.className).toContain(expectedClasses[i]);
    });
  });

  it('should remove toast after duration', () => {
    createContainer();
    showToast('Test', 'success', 500);
    const container = document.getElementById('toast-container')!;

    expect(container.children.length).toBe(1);

    vi.advanceTimersByTime(500);
    // After duration, the toast gets translate-x-10 opacity-0
    // Then after another 300ms, it gets removed
    vi.advanceTimersByTime(300);

    expect(container.children.length).toBe(0);
  });

  it('should translate message via window._tToast when available', () => {
    createContainer();
    (window as any)._tToast = (msg: string) => msg === 'Disalin!' ? 'Copied!' : msg;

    showToast('Disalin!');
    const toast = document.querySelector('#toast-container')!.children[0];
    expect(toast.textContent).toContain('Copied!');

    delete (window as any)._tToast;
  });

  it('should use original message when _tToast is not a function', () => {
    createContainer();
    (window as any)._tToast = 'not a function';

    showToast('Disalin!');
    const toast = document.querySelector('#toast-container')!.children[0];
    expect(toast.textContent).toContain('Disalin!');

    delete (window as any)._tToast;
  });
});
