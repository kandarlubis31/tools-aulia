# Video Studio (/editor) — OmniClip

The **Video Studio** tool at `/editor` is built on **OmniClip**, an open-source,
CapCut-style video editor that runs 100% in the browser (WebCodecs + WebGL/PixiJS,
no upload, no account).

- **Original source:** https://github.com/omni-media/omniclip
- **App site:** https://omniclip.app/
- **License:** MIT (see `omniclip/LICENSE`)

## What we changed (fork adjustments)

1. **Stripped PostHog analytics** + hardcoded project key from `s/main.ts`
   (privacy-first, consistent with ToolsAulia's "no tracking" stance).
2. **Removed `coi-serviceworker`** — nothing in OmniClip needs SharedArrayBuffer,
   and `Cross-Origin-Embedder-Policy: require-corp` would break cross-origin CDN
   libraries in Chrome. Dropping it avoids the double-reload + CORP risk.
3. **FFmpeg core self-hosted** — `FFmpegHelper` now loads `@ffmpeg/core` from
   ToolsAulia's own `/vendor/ffmpeg/` (same-origin, offline-first) instead of
   unpkg (which can be blocked under COEP and has no CORP guarantee).
4. **Windows build fixes for `@benev/turtle`** — see `omniclip/patch-turtle.mjs`
   (re-applied after `npm ci`): glob separator normalization, `file://` ESM
   imports, POSIX-absolute path routing. The upstream build is Linux/macOS-only.

## Layout

| Path | Purpose |
|---|---|
| `omniclip/` | Vendored upstream source (no `.git`, no `node_modules`/`x` in git) |
| `omniclip/patch-turtle.mjs` | Re-applies Windows build patches after `npm ci` |
| `build-dist.mjs` | Assembles the deployable static app into `public/editor/` |
| `public/editor/` | Static output served at `/editor/` (committed) |

## Rebuilding

```bash
cd omniclip
npm ci
node patch-turtle.mjs
export PATH="$(pwd)/node_modules/.bin:$PATH"
bash node_modules/@benev/turtle/scripts/turtle-standard
cp node_modules/coi-serviceworker/coi-serviceworker.js x/
cp -r assets x/
cd ..
node editor/build-dist.mjs
```
