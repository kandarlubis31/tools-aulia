# ADR-001: Vanilla Astro (No UI Framework)

**Status:** Accepted  
**Date:** 2024-12-16  
**Deciders:** Aulia Iskandar Lubis

## Context

ToolsAulia is a collection of 58+ client-side browser tools. Each tool has unique UI requirements — drag-drop zones, canvas rendering, file processing, form inputs, etc. We needed to choose between:

1. **Astro with a UI framework** (React, Vue, Svelte)
2. **Vanilla Astro** (`.astro` files with inline `<script>`)

## Decision

**Chosen: Vanilla Astro with inline scripts.**

## Rationale

- **Zero KB framework overhead.** Every tool page ships only its own JavaScript. No React/Vue runtime tax per page.
- **No hydration mismatch.** All logic runs imperatively in `<script>` tags — no SSR/CSR reconciliation issues.
- **Simpler mental model.** Each `.astro` file is self-contained: HTML template + `<script>` logic. No component tree, no props drilling, no state management.
- **PWA-friendly.** Smaller bundles = faster service worker caching and offline startup.
- **Copy-pasteable tools.** Users can inspect any tool's source and reuse it elsewhere without framework dependencies.

## Consequences

- **No component reuse across tools.** Each tool implements its own UI logic. Addressed by extracting shared logic into `src/composables/`.
- **No type-safe templating.** `.astro` files use string-based HTML. Mitigated by keeping templates simple.
- **Manual i18n.** No framework-level i18n solution. Addressed by custom `_tToast()` pattern and `i18n-phrases.js`.
