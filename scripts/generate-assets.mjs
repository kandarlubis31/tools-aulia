import sharp from 'sharp';
import { writeFileSync } from 'fs';

const ICON_SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
];

// Generate PNG icons from favicon.svg
for (const { name, size } of ICON_SIZES) {
  await sharp('public/favicon.svg')
    .resize(size, size)
    .png()
    .toFile(`public/${name}`);
  console.log(`✅ Generated ${name} (${size}x${size})`);
}

// Generate favicon.ico (multi-size)
await sharp('public/favicon.svg')
  .resize(32, 32)
  .toFile('public/favicon-temp-32.png');
await sharp('public/favicon.svg')
  .resize(16, 16)
  .toFile('public/favicon-temp-16.png');
console.log('✅ Generated favicon.ico source files');

// Generate safari-pinned-tab.svg (monochrome version)
const safariSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="black"/>
  <path d="M8 10h4v12H8zM14 10h4v8h-4zM20 10h4v4h-4z" fill="white" opacity="0.9"/>
</svg>`;
writeFileSync('public/safari-pinned-tab.svg', safariSvg);
console.log('✅ Generated safari-pinned-tab.svg');

// Generate og-image.png (1200x630 social preview)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0ea5e9"/>
      <stop offset="50%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#38bdf8"/>
      <stop offset="100%" style="stop-color:#a78bfa"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" rx="24"/>
  <rect x="430" y="160" width="340" height="180" rx="24" fill="rgba(255,255,255,0.12)"/>
  <text x="600" y="235" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="32" font-weight="600" fill="white" opacity="0.9">TA</text>
  <text x="600" y="305" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="600" fill="white" opacity="0.5">TOOLSAULIA</text>
  <text x="600" y="420" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="60" font-weight="800" fill="white">Tools<span fill="url(#accent)">Aulia</span></text>
  <text x="600" y="480" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="22" font-weight="500" fill="rgba(255,255,255,0.7)">58+ Free Developer Tools — 100% Browser, Zero Upload</text>
  <text x="600" y="530" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="16" font-weight="600" fill="rgba(255,255,255,0.5)">paklubis.my.id</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile('public/og-image.png');
console.log('✅ Generated og-image.png (1200x630)');

console.log('\n🎉 All assets generated!');
