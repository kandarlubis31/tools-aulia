# ADR-002: Custom i18n (Not astro-i18n)

**Status:** Accepted  
**Date:** 2024-12-16  
**Deciders:** Aulia Iskandar Lubis

## Context

ToolsAulia is Indonesian-first with English support. We needed i18n for:
- 58+ tool pages
- Static UI strings (~200 phrases)
- Toast notifications (dynamic, generated in JS)
- SEO metadata (title, description, OG tags)

## Decision

**Chosen: Custom lightweight i18n with `_tToast()` + `i18n-phrases.js`.**

## Rationale

- **No route duplication.** astro-i18n requires `/id/` and `/en/` routes. We wanted single URLs with client-side language toggle via `localStorage`.
- **Smaller build.** No per-locale page generation. One build serves both languages.
- **Toast-friendly.** The `_tToast()` wrapper works inline in JS without importing i18n modules.
- **Progressive enhancement.** Defaults to Indonesian; English phrases loaded async from `/i18n-phrases.js`.

## Consequences

- **SEO limitation.** Search engines only see Indonesian content (default). Mitigated by hreflang tags pointing to same URL.
- **Manual phrase management.** No auto-extraction. All phrases are hand-maintained in `i18n-phrases.js` and `translations.ts`.
- **No pluralization/rules.** Not needed — tool UIs use simple phrase substitution.
