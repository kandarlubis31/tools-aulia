#!/usr/bin/env node

/**
 * ToolsAulia — New Tool Scaffold
 *
 * Usage:
 *   node scripts/new-tool.mjs <category> <slug> "<Title>" "<Description>"
 *
 * Example:
 *   node scripts/new-tool.mjs utils lorem-generator "Lorem Generator" "Generate placeholder text."
 *
 * Generates:
 *   src/pages/<category>/<slug>.astro  — Tool page with BaseLayout
 *   + prompts you to add translations + tool registry entry
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const [,, category, slug, title, description] = process.argv;

if (!category || !slug || !title) {
  console.error('Usage: node scripts/new-tool.mjs <category> <slug> "<Title>" "<Description>"');
  console.error('Categories: calc, dev, file, image, pdf, security, utils');
  process.exit(1);
}

const dir = path.join(ROOT, 'src', 'pages', category);
const filePath = path.join(dir, `${slug}.astro`);

if (fs.existsSync(filePath)) {
  console.error(`❌ File already exists: ${filePath}`);
  process.exit(1);
}

const i18nKeyBase = slug.replace(/-/g, '_');

const template = `---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout pageTitle="${title}">
  <div class="max-w-4xl mx-auto px-4 min-h-[60vh]">

    <div class="text-center mb-10 pt-8 animate-on-scroll">
      <h1 class="text-3xl md:text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-blue-400" data-i18n="header.${i18nKeyBase}">
        ${title}
      </h1>
      <p class="text-matte-600 dark:text-matte-400" data-i18n="header.${i18nKeyBase}_desc">
        ${description || 'Deskripsi tool.'}
      </p>
    </div>

    <!-- Tool UI here -->

  </div>
</BaseLayout>

<script>
  document.addEventListener('astro:page-load', () => {
    // Tool logic here
  });
</script>
`;

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(filePath, template);

console.log(`✅ Created: ${filePath}`);
console.log('');
console.log('📋 Next steps:');
console.log(`  1. Add i18n keys to src/i18n/translations.ts:`);
console.log(`     - header.${i18nKeyBase}`);
console.log(`     - header.${i18nKeyBase}_desc`);
console.log(`  2. Add tool entry to src/data/tools.ts`);
console.log(`  3. Run: pnpm dev`);
