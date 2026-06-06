/**
 * ToolsAulia - Accessibility Composable
 * Keyboard navigation, focus management, and ARIA support
 */

export interface FocusableElement {
  focus: () => void;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
}

/**
 * Trap focus within a container (for modals/dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  
  // Focus first element on trap
  if (firstElement) {
    firstElement.focus();
  }

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Handle escape key press
 */
export function onEscapeKey(callback: () => void): () => void {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  };
  
  document.addEventListener('keydown', handler);
  
  return () => {
    document.removeEventListener('keydown', handler);
  };
}

/**
 * Handle Enter key on an element
 */
export function onEnterKey(
  element: HTMLElement,
  callback: () => void
): () => void {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  };
  
  element.addEventListener('keydown', handler);
  
  return () => {
    element.removeEventListener('keydown', handler);
  };
}

/**
 * Add keyboard navigation to a list/container
 */
export function setupListNavigation(
  container: HTMLElement,
  options: {
    onSelect?: (index: number, element: HTMLElement) => void;
    onEscape?: () => void;
    wrap?: boolean;
    vertical?: boolean;
  } = {}
): () => void {
  const items = container.querySelectorAll('[role="option"], [role="listitem"], li, .item');
  let currentIndex = -1;

  const handleKeyDown = (e: KeyboardEvent) => {
    const { wrap = true, vertical = true, onSelect, onEscape } = options;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (vertical) {
          currentIndex = wrap
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
          (items[currentIndex] as HTMLElement).focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (vertical) {
          currentIndex = wrap
            ? (currentIndex - 1 + items.length) % items.length
            : Math.max(currentIndex - 1, 0);
          (items[currentIndex] as HTMLElement).focus();
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (!vertical) {
          currentIndex = wrap
            ? (currentIndex + 1) % items.length
            : Math.min(currentIndex + 1, items.length - 1);
          (items[currentIndex] as HTMLElement).focus();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (!vertical) {
          currentIndex = wrap
            ? (currentIndex - 1 + items.length) % items.length
            : Math.max(currentIndex - 1, 0);
          (items[currentIndex] as HTMLElement).focus();
        }
        break;

      case 'Enter':
      case ' ':
        if (currentIndex >= 0 && onSelect) {
          e.preventDefault();
          onSelect(currentIndex, items[currentIndex] as HTMLElement);
        }
        break;

      case 'Escape':
        if (onEscape) {
          onEscape();
        }
        break;
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  
  // Make container focusable
  if (!container.hasAttribute('tabindex')) {
    container.setAttribute('tabindex', '0');
  }

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  
  document.body.appendChild(announcer);
  
  // Small delay to ensure screen reader picks up the change
  setTimeout(() => {
    announcer.textContent = message;
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }, 100);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/**
 * Setup skip link functionality
 */
export function setupSkipLink(linkId: string, targetId: string): void {
  const skipLink = document.getElementById(linkId);
  const target = document.getElementById(targetId);
  
  if (skipLink && target) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      target.tabIndex = -1;
      target.focus();
      target.removeAttribute('tabindex');
    });
  }
}