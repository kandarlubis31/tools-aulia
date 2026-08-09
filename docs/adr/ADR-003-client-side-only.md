# ADR-003: Client-Side Only Architecture

**Status:** Accepted  
**Date:** 2024-12-16  
**Deciders:** Aulia Iskandar Lubis

## Context

ToolsAulia processes files and data entirely in the browser. We needed to decide whether to add server-side processing for heavier operations (PDF compression, image background removal, AI models).

## Decision

**Chosen: 100% client-side. No server-side processing.**

## Rationale

- **Privacy.** User files never leave their browser. No upload, no server storage, no GDPR/data compliance burden.
- **Offline capability.** With PWA service worker, all tools work offline after first visit.
- **Zero server costs.** Static HTML/CSS/JS hosting on Vercel's free tier. No compute costs.
- **Instant processing.** No upload/download latency. Large files process at local disk speed.
- **Trust signal.** "No data sent to server" is a key differentiator in the Indonesian market where data privacy concerns are high.

## Consequences

- **Client-side library size.** Libraries like pdf.js (3MB), @imgly/background-removal (15MB model) must be downloaded. Mitigated by CDN loading + service worker caching.
- **Device-dependent performance.** Older phones may struggle with PDF rendering. Mitigated by quality sliders and progress indicators.
- **No server-side validation.** Cannot verify file integrity server-side. All validation is client-side.
