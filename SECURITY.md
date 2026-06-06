# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ All versions    |
| < 1.0   | ❌ Not supported   |

## 🔒 Security Model

ToolsAulia is a **client-side only** application. This means:

- ✅ **No server-side processing** - All operations happen in the browser
- ✅ **No data upload** - Your files never leave your device
- ✅ **No user tracking** - We don't collect any analytics
- ✅ **No external API calls** - Except for optional CDN libraries (loaded securely)

### What This Means for Security

1. **Your data stays local** - PDF processing, image manipulation, and all other operations are performed entirely within your browser
2. **No server vulnerabilities** - Since there's no backend, there are no server-side vulnerabilities (SQL injection, SSRF, etc.)
3. **CSP protection** - Content Security Policy headers are configured
4. **No user accounts** - No authentication vulnerabilities, no password database

## ⚠️ Potential Concerns

### External CDN Dependencies

Some tools load libraries from CDNs:
- `pdf.js` for PDF processing
- `crypto-js` for hashing
- QR code libraries
- etc.

**Mitigation:**
- Use trusted CDNs (cdnjs, jsdelivr)
- Subresource Integrity (SRI) where possible
- Consider self-hosting for paranoid setups

### XSS Prevention

Since ToolsAulia processes user input (file names, text, etc.):

- All user input is properly escaped
- No `innerHTML` with user data (DOM APIs used instead)
- CSP headers prevent inline script injection

### File Processing

**Note:** When processing files from untrusted sources:
- Files are processed entirely client-side
- No malicious code can affect the server
- However, browser-based file processing has its own limitations

## 🐞 Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. **Email** the maintainer directly at: kandarlubis31@gmail.com
3. **Include** in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

### What to Expect

- **Response time**: We aim to respond within 48 hours
- **Initial assessment**: We'll evaluate the vulnerability
- **Updates**: We'll keep you updated on our progress
- **Credit**: With your permission, we'll credit you in the security advisory

### Scope

In-scope vulnerabilities:
- XSS vulnerabilities
- CSRF vulnerabilities  
- Client-side file processing issues
- CSP bypass attempts
- CDN supply chain concerns

Out of scope:
- Social engineering attacks
- Physical security
- Denial of service (browser-based, difficult to prevent)
- Vulnerabilities in third-party CDNs (report to them directly)

## 🔐 Best Practices for Users

1. **Use HTTPS** - Always access the site over HTTPS
2. **Keep browser updated** - Use a modern, updated browser
3. **Review permissions** - Only grant necessary PWA permissions
4. **Trust the source** - Only use the official domain

## 📋 Security Changelog

| Date | Version | Description |
|------|---------|-------------|
| 2024-06-07 | 1.0.0 | Initial security review | |

## 🔑 Security-Related Files

- `astro.config.mjs` - Contains CSP and security headers configuration
- `src/composables/useProgress.ts` - XSS-safe DOM manipulation
- `src/composables/useClipboard.ts` - Safe clipboard operations

---

**Maintained by:** Aulia Iskandar Lubis  
**Repository:** https://github.com/kandarlubis31/tools-aulia