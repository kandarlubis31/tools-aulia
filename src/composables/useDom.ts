/**
 * ToolsAulia - Safe DOM Manipulation Composable
 * XSS-safe alternatives to innerHTML for user-generated content
 */

/**
 * Creates an element with optional text content and children
 * Safe alternative to innerHTML for simple content
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    text?: string;
    className?: string;
    attrs?: Record<string, string>;
    children?: (HTMLElement | string)[];
    onclick?: (ev: MouseEvent) => void;
  } = {}
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  
  if (options.text) {
    el.textContent = options.text;
  }
  
  if (options.className) {
    el.className = options.className;
  }
  
  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      el.setAttribute(key, value);
    }
  }
  
  if (options.children) {
    for (const child of options.children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
  }
  
  if (options.onclick) {
    el.addEventListener('click', options.onclick as EventListener);
  }
  
  return el;
}

/**
 * Clear all children from an element (safe alternative to innerHTML = '')
 */
export function clearElement(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Set text content safely (prevents XSS)
 */
export function setText(element: HTMLElement, text: string): void {
  element.textContent = text;
}

/**
 * Append a text node safely
 */
export function appendText(parent: HTMLElement, text: string): Text {
  return parent.appendChild(document.createTextNode(text));
}

/**
 * Create HTML string for trusted content only (developer-defined, not user input)
 * Use this only for static, trusted HTML templates
 */
export function safeHTML(html: string): string {
  // Only use this for static content you control
  // NEVER use with user-generated content
  return html;
}

/**
 * Simple template renderer using DOM APIs (safe alternative to innerHTML templates)
 */
export function renderTemplate(
  container: HTMLElement,
  template: string,
  data: Record<string, string>,
  trusted = false
): void {
  if (!trusted) {
    // For untrusted content, use textContent-based approach
    // Replace {{variable}} placeholders safely
    const sanitized = template.replace(/\\{\\{(.+?)\\}\\}/g, (_, key) => {
      const value = data[key.trim()] || '';
      return escapeHtml(value);
    });
    container.textContent = sanitized;
  } else {
    // For trusted content (static templates), use innerHTML
    // Only use when you are certain content is safe
    const result = template.replace(/\\{\\{(.+?)\\}\\}/g, (_, key) => {
      return data[key.trim()] || '';
    });
    container.innerHTML = result;
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create a button with proper accessibility attributes
 */
export function createButton(
  options: {
    text: string;
    className?: string;
    icon?: string; // SVG innerHTML (trusted only)
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
    title?: string;
    variant?: 'primary' | 'secondary' | 'danger';
  }
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = options.text;
  
  if (options.className) {
    btn.className = options.className;
  }
  
  if (options.icon) {
    btn.innerHTML = options.icon;
  }
  
  if (options.disabled) {
    btn.disabled = true;
  }
  
  if (options.ariaLabel) {
    btn.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.title) {
    btn.setAttribute('title', options.title);
  }
  
  if (options.variant === 'primary') {
    btn.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
  } else if (options.variant === 'secondary') {
    btn.classList.add('bg-slate-100', 'dark:bg-slate-700', 'hover:bg-slate-200', 'dark:hover:bg-slate-600');
  } else if (options.variant === 'danger') {
    btn.classList.add('bg-red-600', 'hover:bg-red-700', 'text-white');
  }
  
  if (options.onClick) {
    btn.addEventListener('click', options.onClick);
  }
  
  return btn;
}

/**
 * Create an icon-only button with proper accessibility
 */
export function createIconButton(
  svgIcon: string, // Trusted SVG markup
  options: {
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel: string;
    title?: string;
    className?: string;
  }
): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', options.ariaLabel);
  btn.innerHTML = svgIcon;
  
  if (options.title) {
    btn.setAttribute('title', options.title);
  }
  
  if (options.className) {
    btn.className = options.className;
  }
  
  if (options.disabled) {
    btn.disabled = true;
  }
  
  if (options.onClick) {
    btn.addEventListener('click', options.onClick);
  }
  
  return btn;
}