import { vi, afterEach } from 'vitest';

/**
 * ToolsAulia - Vitest Test Setup
 * Global test configuration and mocks
 */

// Mock window.showToast
Object.defineProperty(window, 'showToast', {
  value: vi.fn(),
  writable: true,
});

// Mock window._tToast
Object.defineProperty(window, '_tToast', {
  value: (key: string) => key,
  writable: true,
});

// Mock toast container element with lastElementChild
export const mockToastContainer = {
  lastElementChild: null as Element | null,
  appendChild: vi.fn((el: Element) => el),
  querySelector: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

/**
 * Helper to set mock toast element for tests
 */
export function setMockToastElement(element: Element | null) {
  mockToastContainer.lastElementChild = element;
}

// Mock document.querySelector for toast container
const mockQuerySelector = vi.fn((selector: string) => {
  if (selector === '#toast-container') {
    return mockToastContainer;
  }
  return null;
});

Object.defineProperty(document, 'querySelector', {
  value: mockQuerySelector,
  writable: true,
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
});

// Mock createObjectURL
URL.createObjectURL = vi.fn(() => 'blob:test-url');
URL.revokeObjectURL = vi.fn();

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as unknown as typeof fetch;

// Mock crypto for UUID tests
Object.defineProperty(crypto, 'randomUUID', {
  value: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }),
  writable: true,
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});