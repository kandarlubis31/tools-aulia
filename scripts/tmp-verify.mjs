import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'dist/client');
const PORT = 8899, CDP = 9223;
const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.mjs':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.json':'application/json', '.webmanifest':'application/manifest+json', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2', '.ico':'image/x-icon' };

// --- static server ---
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = join(ROOT, p);
  try {
    const data = readFileSync(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(PORT, r));

// --- chrome ---
const profile = mkdtempSync(join(tmpdir(), 'cdp-'));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${profile}`,
  '--window-size=1440,900', '--no-first-run', 'about:blank',
], { stdio: 'ignore' });

let wsUrl;
for (let i = 0; i < 40; i++) {
  await new Promise(r => setTimeout(r, 250));
  try {
    const list = await (await fetch(`http://127.0.0.1:${CDP}/json/list`)).json();
    const page = list.find(t => t.type === 'page');
    if (page) { wsUrl = page.webSocketDebuggerUrl; break; }
  } catch {}
}
if (!wsUrl) { console.error('NO_CDP'); process.exit(1); }

const ws = new WebSocket(wsUrl);
await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method) events.push(m.method);
};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

await send('Page.enable');
await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
while (!events.includes('Page.loadEventFired')) await sleep(100);
await sleep(600);

const evalJS = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  return r.result?.result?.value;
};

// --- 1. header geometry ---
const header = await evalJS(`(() => {
  const out = {};
  for (const id of ['search-btn','theme-toggle-desktop','lang-toggle-desktop']) {
    const el = document.getElementById(id);
    if (!el) { out[id] = null; continue; }
    const b = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    out[id] = { w: Math.round(b.width), h: Math.round(b.height), radius: cs.borderRadius, bg: cs.backgroundColor };
  }
  return out;
})()`);

// --- 2. favicon render test (SVG-as-image isolation, canvas pixel sampling) ---
const favicon = await evalJS(`new Promise(res => {
  const img = new Image();
  img.onload = () => {
    try {
      const c = document.createElement('canvas'); c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0, 64, 64);
      const d = x.getImageData(0, 0, 64, 64).data;
      let dark = 0, colored = 0, mid = 0;
      for (let i = 0; i < d.length; i += 4) {
        const [r, g, b, a] = [d[i], d[i+1], d[i+2], d[i+3]];
        const lum = 0.2126*r + 0.7152*g + 0.0722*b;
        const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
        if (a > 200 && lum < 90) dark++;
        if (mx - mn > 40) colored++;
        if (lum >= 90 && lum <= 200) mid++;
      }
      res({ ok: true, natural: img.naturalWidth, darkPx: dark, coloredPx: colored, midPx: mid });
    } catch (e) { res({ ok: false, err: String(e) }); }
  };
  img.onerror = () => res({ ok: false, err: 'image load error' });
  img.src = '/favicon.svg?v=' + Date.now();
})`);

// --- 3. screenshots: desktop header + mobile ---
const shot = async (clip, name) => {
  const r = await send('Page.captureScreenshot', { format: 'png', ...(clip ? { clip } : {}) });
  const p = join(tmpdir(), name);
  writeFileSync(p, Buffer.from(r.data, 'base64'));
  return p;
};
const headerPng = await shot({ x: 0, y: 0, width: 1440, height: 72, scale: 1 }, 'masaul-header-desktop.png');

await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 844, deviceScaleFactor: 2, mobile: true });
await sleep(500);
const pagination = await evalJS(`(() => {
  const pg = document.getElementById('pagination');
  if (!pg) return { exists: false };
  const b = pg.getBoundingClientRect();
  return { exists: true, width: Math.round(b.width), viewport: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
})()`);
const mobilePng = await shot({ x: 0, y: 0, width: 375, height: 844, scale: 1 }, 'masaul-home-mobile.png');

console.log(JSON.stringify({ header, favicon, pagination, headerPng, mobilePng }, null, 1));

chrome.kill(); server.close(); process.exit(0);
