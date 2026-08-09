# ToolsAulia — Current State

> Last updated: August 10, 2026  
> Site: **https://tools.paklubis.my.id** · Deployed on Vercel

## 📊 Audit Complete — 16/16 Items + 6/6 Quick Wins

All items from [audit-plan.md](audit-plan.md) have been audited and fixed where needed. See the audit doc for full details and scorecard.

## ✅ Completed (34 Phases)

### Session August 10, 2026

| # | Improvement | Detail |
|---|------------|--------|
| 19.17 | **Batch download** | PDF to Image: JSZip CDN, "Download All as ZIP", progress, race guard |
| 19.18 | **Quality slider** | PDF to Image: 0.5x–3x scale + resolution estimate, Tailwind safelist |
| 19.19 | **PDF composables** | usePdfDropZone, usePdfRenderer, usePdfDownload — ~650 lines saved |
| 19.20 | **Error boundary** | Global window.onerror + unhandledrejection in BaseLayout |
| 19.21 | **to-jpg migrated** | First tool migrated to composables (demo pattern) |
| 19.22 | **compress migrated** | compress.astro migrated to PDF composables |
| 19.23 | **Offline UX** | Cache-aware toast, first-cache notification, offline-ready badge |
| 19.24 | **Mobile fixes** | 3 critical <360px fixes (cron, wa-builder, html-to-img) |
| 19.25 | **A11y fixes** | 6 modal dialog roles, 9 aria-labels, WCAG improvements |
| 19.26 | **i18n fixes** | 12 hardcoded strings wrapped with _tToast() fallback |
| 19.27 | **Composable tests** | 3 new test files (useLoading, useLocalHistory, useShare) |
| 19.28 | **Audit #5, #7, #8, #11** | i18n, mobile, a11y, offline UX audited & fixed |
| 19.29 | **Dark mode verified** | Only 12 decorative inline colors, no migration needed |
| 19.30 | **PDF.js verified** | waitForPdfjs pattern confirmed safe, no layout shift |
| 19.31 | **Quick Wins Q1-Q6** | lazy imgs, CONTRIBUTING.md updated, vscode settings |
| 19.32 | **4 ADRs created** | Vanilla Astro, custom i18n, client-side only, CDN libraries |
| 19.33 | **CI/CD + scaffold** | GitHub Actions workflow, scripts/new-tool.mjs |
| 19.34 | **Vitest running** | 6 test files, 43 tests passing. CSP headers via vercel.json |
| 19.35 | **Audit #15, #16** | CSP headers deployed, perf budget documented |
| 19.36 | **pnpm test** | Test script added to package.json |

## 🔜 Next Up

- **Migrate more PDF tools** to composables (split, merge, rotate, etc.) — ~16 tools remain
- **E2E Playwright tests** — smoke test homepage + 5 key tools
- **Performance budget** — Lighthouse CI monitoring

## 📁 New Files Created (Session)

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest configuration with jsdom |
| `vercel.json` | CSP + security headers |
| `scripts/new-tool.mjs` | Tool scaffold script |
| `.github/workflows/ci.yml` | CI/CD pipeline |
| `.vscode/settings.json` | Format-on-save, Tailwind intellisense |
| `src/composables/useLoading.test.ts` | 9 tests |
| `src/composables/useLocalHistory.test.ts` | 12 tests |
| `src/composables/useShare.test.ts` | 8 tests |
| `docs/adr/ADR-001-vanilla-astro.md` | Architecture decision |
| `docs/adr/ADR-002-custom-i18n.md` | Architecture decision |
| `docs/adr/ADR-003-client-side-only.md` | Architecture decision |
| `docs/adr/ADR-004-cdn-libraries.md` | Architecture decision |

## 🧪 Test Suite

```
pnpm test        # 43 tests across 6 files
pnpm test:watch  # Watch mode
```

See [audit-plan.md](audit-plan.md) for full improvement roadmap.
