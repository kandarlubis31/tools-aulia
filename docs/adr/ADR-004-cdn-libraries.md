# ADR-004: CDN vs npm for Heavy Libraries

**Status:** Accepted  
**Date:** 2024-12-16  
**Deciders:** Aulia Iskandar Lubis

## Context

ToolsAulia uses several large JavaScript libraries:
- **pdf.js** (~3MB) — PDF rendering
- **pdf-lib** (~500KB) — PDF manipulation
- **html2canvas** (~200KB) — HTML to image
- **@imgly/background-removal** (~15MB model) — AI background removal
- **JSZip** (~100KB) — ZIP creation batch download
- **cronstrue, luxon** (~50KB each) — developer utilities

We needed to decide: bundle via npm or load from CDN.

## Decision

**Chosen: CDN for heavy libraries, npm for lightweight utilities.**

| Library | Source | Rationale |
|---------|--------|-----------|
| pdf.js | CDN (cdnjs) | 3MB — too large to bundle; CDN enables parallel download + caching |
| pdf-lib | npm (dynamic import) | 500KB — used by compress tool only; lazy-loaded on demand |
| html2canvas | CDN (cdnjs) | 200KB — used by 2 tools; CDN caching |
| @imgly/background-removal | npm (dynamic import) | 15MB model — must be lazy-loaded; npm controls version |
| JSZip | CDN (cdnjs) | 100KB — used by 1 tool; CDN caching |
| cronstrue, luxon | CDN (jsdelivr) | Small but infrequently used; CDN leverages cross-site cache |

## Rationale

- **Bundle size.** npm would add 4MB+ to the main bundle. CDN loads libraries in parallel via `<script is:inline src="...">`.
- **Cross-site caching.** Users who visited other sites using pdf.js from cdnjs already have it cached.
- **Service worker.** PWA runtime caching with StaleWhileRevalidate ensures offline availability after first load.
- **Lazy loading.** npm dynamic `import()` for pdf-lib and @imgly/background-removal ensures they only download when the tool is used.

## Consequences

- **CDN dependency.** If cdnjs/jsdelivr is down, tools break. Mitigated by service worker caching + multiple CDN fallback (cdnjs + jsdelivr).
- **Version management.** CDN URLs are pinned to specific versions in source code. Manual update required.
- **No tree-shaking.** CDN serves full library. Acceptable since tools use most features of each library.
