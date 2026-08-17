#!/usr/bin/env node
/**
 * Build the static deploy output for the OmniClip video editor.
 *
 * Input : omniclip/x/  (result of `npm run build` inside omniclip/)
 * Output: public/editor/  (served by Astro at /editor/)
 *
 * What it does:
 *  1. Rewrites index.html   — use the rollup bundle (main.bundle.min.js), strip
 *     coi-serviceworker (nothing needs SharedArrayBuffer → avoids COEP/CORP
 *     breaking CDN libs), fix absolute /assets/ → relative, set title.
 *  2. Rewrites main.bundle.min.js — /assets/ → ./assets/ (all URL string literals).
 *  3. Rewrites index.css — ../assets/ → ./assets/.
 *  4. Builds a trimmed importmap.json with only the packages the bundle imports
 *     at runtime (via bare specifiers), pointing at ./node_modules/...
 *  5. Copies the node_modules closure (BFS over import statements + new URL)
 *     so the deploy needs no full node_modules.
 *  6. Copies assets/ (demo videos, fonts, MediaInfoModule.wasm, icons).
 */
import { readFile, writeFile, mkdir, cp, rm, stat } from "node:fs/promises";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const SRC = join(root, "omniclip", "x");
const OUT = join(root, "public", "editor");
const NM = join(root, "omniclip", "node_modules");

// --- bare specifiers the bundle imports externally -------------------------
const ENTRIES = [
  "@ffmpeg/ffmpeg/dist/esm/index.js",
  "@ffmpeg/util/dist/esm/index.js",
  "web-demuxer/dist/web-demuxer.js",
  "ffprobe-wasm/browser.mjs",
  "@zip.js/zip.js/index.js",
  "@floating-ui/dom/dist/floating-ui.dom.browser.mjs",
];

const importMap = JSON.parse(await readFile(join(SRC, "importmap.json"), "utf-8")).imports;

function resolveBare(spec) {
  // longest-prefix match against importmap keys
  let best = null;
  for (const key of Object.keys(importMap)) {
    if (spec === key || (key.endsWith("/") && spec.startsWith(key))) {
      if (!best || key.length > best.length) best = key;
    }
  }
  if (!best) return null;
  let value = importMap[best];
  if (value.endsWith("/")) value += spec.slice(best.length);
  if (!value.startsWith("/node_modules/")) return null;
  return value.slice("/node_modules/".length).split("/").join(sep);
}

// --- closure walker ----------------------------------------------------------
const usedImportMapKeys = new Set();

function fileExists(p) {
  return stat(p).then(() => true, () => false);
}

async function parseImports(absPath) {
  let src;
  try { src = await readFile(absPath, "utf-8"); } catch { return []; }
  const out = new Set();
  const re = [
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /(?:^|\n)\s*import\s+[^'"]*?\s+from\s*['"]([^'"]+)['"]/g,
    /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g,
    /export\s+[^'"]*?\s+from\s*['"]([^'"]+)['"]/g,
    /new\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g,
  ];
  for (const r of re) {
    let m;
    while ((m = r.exec(src))) out.add(m[1]);
  }
  return [...out];
}

async function collectClosure() {
  const files = new Map(); // node_modules-relative path -> source abs path
  const queue = []; // node_modules-relative paths (forward slashes)
  const seen = new Set();

  for (const spec of ENTRIES) {
    let best = null;
    for (const key of Object.keys(importMap)) {
      if (spec === key || (key.endsWith("/") && spec.startsWith(key))) {
        if (!best || key.length > best.length) best = key;
      }
    }
    if (best) usedImportMapKeys.add(best);
    const rel = resolveBare(spec);
    if (rel) { queue.push(rel); seen.add(rel); }
  }

  while (queue.length) {
    const rel = queue.shift();
    const abs = join(NM, rel);
    if (!(await fileExists(abs))) continue;
    files.set(rel, abs);

    const imports = await parseImports(abs);
    for (const imp of imports) {
      if (/^(https?:|data:|blob:)/.test(imp)) continue; // CDN / data — skip
      let childRel;
      if (imp.startsWith("./") || imp.startsWith("../")) {
        childRel = join(dirname(rel), imp).split(sep).join("/");
      } else {
        // bare — record which importmap key resolves it
        let best = null;
        for (const key of Object.keys(importMap)) {
          if (imp === key || (key.endsWith("/") && imp.startsWith(key))) {
            if (!best || key.length > best.length) best = key;
          }
        }
        if (best) usedImportMapKeys.add(best);
        childRel = resolveBare(imp);
      }
      if (!childRel || seen.has(childRel)) continue;
      seen.add(childRel);
      queue.push(childRel);
    }
  }
  return files;
}

// --- main --------------------------------------------------------------------
console.log(`clean ${OUT}`);
await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// 1. index.html — ABSOLUTE paths (/editor/...) so the app works whether the page is
//    served at /editor or /editor/ (relative paths would resolve to the site root
//    without a trailing slash → 404 + MIME errors, as seen in production).
let html = await readFile(join(SRC, "index.html"), "utf-8");
html = html
  .replace(/<script src="coi-serviceworker\.js"><\/script>\s*/g, "")
  .replace('src="./main.js"', 'src="/editor/main.bundle.min.js"')
  .replace('src="./importmap.json"', 'src="/editor/importmap.json"')
  .replace('href="index.css?v=', 'href="/editor/index.css?v=')
  .replace('href="index.css"', 'href="/editor/index.css"')
  .replace('href="./assets/favicon-32x32.png"', 'href="/editor/assets/favicon-32x32.png"')
  .replace('src="/assets/icon3.png"', 'src="/editor/assets/icon3.png"')
  .replace(/<title>omni-clip<\/title>/, "<title>Video Editor | ToolsAulia</title>")
  .replace(/<title>omniclip<\/title>/, "<title>Video Editor | ToolsAulia</title>");
await writeFile(join(OUT, "index.html"), html);

// 2. main.bundle.min.js — rewrite asset refs to ABSOLUTE /editor/assets/...
let bundle = await readFile(join(SRC, "main.bundle.min.js"), "utf-8");
bundle = bundle
  .replace(/\$\{window\.location\.origin\}\/assets\/MediaInfoModule\.wasm/g, "/editor/assets/MediaInfoModule.wasm")
  .replace(/`\/assets\//g, "`/editor/assets/")
  .replace(/["']\/assets\//g, (m) => (m.startsWith('"') ? '"/editor/assets/' : "'/editor/assets/"));
await writeFile(join(OUT, "main.bundle.min.js"), bundle);

// 3. index.css — absolute paths (url() resolves against the CSS file, but keep it
//    consistent with the page so /editor vs /editor/ both work).
let css = await readFile(join(SRC, "index.css"), "utf-8");
css = css
  .replace(/\.\.\/assets\//g, "/editor/assets/")
  .replace(/\.\/assets\//g, "/editor/assets/")
  .replace(/\.\/views\//g, "/editor/views/");
await writeFile(join(OUT, "index.css"), css);

// 4+5. closure + trimmed importmap
const closure = await collectClosure();
console.log(`closure files: ${closure.size}`);
for (const [rel, abs] of closure) {
  const dest = join(OUT, "node_modules", rel);
  await mkdir(dirname(dest), { recursive: true });
  await cp(abs, dest);
}
const trimmed = {};
for (const key of usedImportMapKeys) {
  trimmed[key] = importMap[key].replace("/node_modules/", "/editor/node_modules/");
}
await writeFile(join(OUT, "importmap.json"), JSON.stringify({ imports: trimmed }, null, 2));

// 6. assets
await cp(join(SRC, "assets"), join(OUT, "assets"), { recursive: true });

// 7. auxiliary dirs referenced at runtime (tooltip styles.css via index.css @import)
for (const dir of ["views", "tools", "icons"]) {
  await cp(join(SRC, dir), join(OUT, dir), { recursive: true });
}

// 8. favicon — upstream omniclip references ./assets/favicon-32x32.png but ships none;
//    use ToolsAulia's own favicon so the tab icon is on-brand.
await cp(join(root, "public", "favicon-32x32.png"), join(OUT, "assets", "favicon-32x32.png"));

console.log("done →", OUT);
