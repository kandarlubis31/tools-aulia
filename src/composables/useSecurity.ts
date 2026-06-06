/**
 * ToolsAulia - Security Utilities Composable
 * Input sanitization, validation, and safe operations
 */

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate file type by checking magic bytes (not just extension)
 */
export async function validateFileMagicBytes(
  file: File,
  validMagicBytes: { bytes: number[]; offset?: number; mime: string }[]
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(buffer);
      
      for (const signature of validMagicBytes) {
        const offset = signature.offset || 0;
        const isMatch = signature.bytes.every(
          (byte, i) => bytes[offset + i] === byte
        );
        if (isMatch) {
          resolve(true);
          return;
        }
      }
      resolve(false);
    };
    reader.onerror = () => resolve(false);
    // Read first 8 bytes for magic byte detection
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
}

/**
 * File type signatures for common formats
 */
export const FILE_SIGNATURES = {
  pdf: { bytes: [0x25, 0x50, 0x44, 0x46], mime: 'application/pdf' },
  png: { bytes: [0x89, 0x50, 0x4e, 0x47], mime: 'image/png' },
  jpg: { bytes: [0xff, 0xd8, 0xff], mime: 'image/jpeg' },
  gif: { bytes: [0x47, 0x49, 0x46, 0x38], mime: 'image/gif' },
  webp: { bytes: [0x52, 0x49, 0x46, 0x46], offset: 8, mime: 'image/webp' },
  zip: { bytes: [0x50, 0x4b, 0x03, 0x04], mime: 'application/zip' },
};

/**
 * Validate URL to prevent javascript: and data: URLs
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Block dangerous protocols
    if (['javascript:', 'data:', 'vbscript:'].includes(parsed.protocol)) {
      return false;
    }
    // Only allow http/https (and mailto for email links)
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\u0000-\u001F\u007F]+@[^\u0000-\u001F\u007F]+\.[^\u0000-\u001F\u007F]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize HTML to allow only safe tags
 */
export function sanitizeHtml(html: string, allowedTags: string[] = ['p', 'br', 'strong', 'em']): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const allowedSet = new Set(allowedTags.map(t => t.toLowerCase()));
  
  const nodesToRemove: Node[] = [];
  let node = walker.nextNode();
  
  while (node) {
    if (node instanceof Element && !allowedSet.has(node.tagName.toLowerCase())) {
      nodesToRemove.push(node);
    }
    node = walker.nextNode();
  }
  
  nodesToRemove.forEach(n => n.parentNode?.removeChild(n));
  
  return doc.body.textContent || '';
}

/**
 * Validate file size before processing
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Escape regex special characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&');
}

/**
 * Generate Content Security Policy meta tag
 */
export function generateCspHeader(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ];
  return directives.join('; ');
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  return window.isSecureContext === true;
}

/**
 * Validate UUID format
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components and dangerous characters
  return filename
    .replace(/^.*[\\\\/]/, '') // Remove path
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .substring(0, 255); // Limit length
}