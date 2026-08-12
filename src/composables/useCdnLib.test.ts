import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { waitForCdnLib } from './useCdnLib';

describe('waitForCdnLib', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    delete (window as any).cdnTestLib;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete (window as any).cdnTestLib;
  });

  it('resolves true immediately when the library is already on window', async () => {
    (window as any).cdnTestLib = {};
    await expect(waitForCdnLib('cdnTestLib')).resolves.toBe(true);
  });

  it('resolves true once the library appears after a few ticks', async () => {
    const promise = waitForCdnLib('cdnTestLib', { interval: 50, maxRetries: 10 });
    // Library appears after ~2.4 ticks (at 120ms)
    setTimeout(() => {
      (window as any).cdnTestLib = {};
    }, 120);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBe(true);
  });

  it('resolves false after maxRetries when the library never loads', async () => {
    const promise = waitForCdnLib('neverLoadedLib', { interval: 50, maxRetries: 4 });
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBe(false);
  });

  it('uses default options when none are provided (30 retries @ 100ms)', async () => {
    const promise = waitForCdnLib('neverLoadedDefault');
    vi.advanceTimersByTime(4000); // 30 * 100ms = 3s of retries
    await expect(promise).resolves.toBe(false);
  });

  it('does not resolve twice once a library is found', async () => {
    const spy = vi.fn();
    (window as any).cdnTestLib = {};
    const promise = waitForCdnLib('cdnTestLib', { interval: 50, maxRetries: 5 }).then((ok) => {
      spy(ok);
      return ok;
    });
    vi.advanceTimersByTime(1000);
    await promise;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(true);
  });
});
