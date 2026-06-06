# ToolsAulia Architecture

## Overview

ToolsAulia is a client-side only web application built with [Astro](https://astro.build). All tool processing happens entirely in the browser - no data is ever sent to a server.

## 🎯 Design Principles

1. **Privacy First** - All data processing happens client-side
2. **No Dependencies on Backend** - Works entirely offline after initial load
3. **Progressive Enhancement** - Core functionality works, enhanced features when available
4. **Type Safety** - TypeScript with strict typing throughout

---

## 📁 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client-Side)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Pages     │  │Components   │  │  Layouts    │         │
│  │  (Astro)    │  │  (Astro)    │  │  (Astro)    │         │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘         │
│         │                │                                  │
│         ▼                ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Composables (Reusable Logic)            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │useToast │ │useFile  │ │useClip  │ │useProg  │   │   │
│  │  │         │ │Handler  │ │board    │ │ress     │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    Types                             │   │
│  │              (TypeScript Interfaces)                 │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Registry                           │   │
│  │              (Plugin-based Tool Registry)            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              i18n (Internationalization)             │   │
│  │                  (ID/EN Support)                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Static Files)
┌─────────────────────────────────────────────────────────────┐
│                     CDN / Hosting                           │
│            (Netlify, Vercel, GitHub Pages)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Core Components

### 1. Pages (`src/pages/`)

Each tool is a standalone Astro page. Pages are organized by category:

| Category | Path | Examples |
|----------|------|----------|
| PDF Tools | `/pdf/` | merge, compress, split, rotate |
| Image Tools | `/image/` | compressor, converter, color |
| Developer Tools | `/dev/` | json, base64, cron, diff |
| Calculators | `/calc/` | bmi, age, currency, percentage |
| Security | `/security/` | hash, password, uuid |
| Utilities | `/utils/` | qr, stopwatch, todo, pomodoro |
| File Tools | `/file/` | csv-json, pdf-to-md |

**Page Structure:**
```astro
---
// 1. Frontmatter: Layout, meta tags, imports
import BaseLayout from '../../layouts/BaseLayout.astro';

const pageTitle = "Tool Name";
---

<!-- 2. HTML: Tool UI -->
<BaseLayout>
  <main>
    <!-- Tool interface -->
  </main>
</BaseLayout>

<!-- 3. Scripts: Tool logic -->
<script>
  // Tool implementation using composables
</script>
```

### 2. Components (`src/components/`)

Reusable UI components:

- `ToolCard.astro` - Card component for tool listings
- `PWAHead.astro` - PWA meta tags and registration

### 3. Layouts (`src/layouts/`)

- `BaseLayout.astro` - Main layout with header, footer, navigation, theme toggle, i18n, PWA support, toast notifications

### 4. Composables (`src/composables/`)

Reusable logic functions that can be used across tools:

| Composable | Purpose |
|------------|---------|
| `useToast` | Toast notification system with translation support |
| `useFileHandler` | Drag-and-drop file handling with validation |
| `useClipboard` | Copy to clipboard with fallback |
| `useProgress` | Progress bar with XSS-safe DOM creation |

### 5. Types (`src/types/`)

TypeScript interfaces:

```typescript
// src/types/tool.ts
interface ToolDefinition {
  id: string;
  nameKey: string;      // i18n key
  descKey: string;      // i18n key
  icon: string;
  color: ThemeColor;
  path: string;
}

interface ToolCategory {
  id: string;
  nameKey: string;
  icon: string;
  tools: ToolDefinition[];
}
```

### 6. Registry (`src/lib/registry.ts`)

Centralized tool registry with plugin-based architecture:

```typescript
// Provides:
// - getAllTools() - List all available tools
// - getToolsByCategory(category) - Tools in a category
// - getToolById(id) - Single tool lookup
// - searchTools(query) - Search functionality
```

### 7. i18n (`src/i18n/translations.ts`)

Internationalization system supporting:
- Indonesian (ID) - Default
- English (EN) - Secondary

All user-facing strings use translation keys, never hardcoded text.

---

## 🔌 Plugin Architecture

Tools are registered in the central registry:

```typescript
// src/lib/registry.ts
export const tools: ToolDefinition[] = [
  {
    id: 'pdf-merge',
    nameKey: 'tool.merge',
    descKey: 'tool.merge_desc',
    icon: '...', // SVG path
    color: 'blue',
    path: '/pdf/merge',
  },
  // ... more tools
];
```

This enables:
- Dynamic tool listing
- Search functionality across all tools
- Consistent tool card rendering
- Easy tool addition/removal

---

## 🎨 Styling Architecture

### Tailwind CSS

- Utility-first CSS framework
- Dark mode support via `dark:` prefix
- Custom theme configuration in `tailwind.config.mjs`

### Global Styles

- `src/styles/global.css` - Global styles, Tailwind imports
- CSS custom properties for theming
- Smooth transitions and animations

### Theme System

```typescript
// Theme colors available
type ThemeColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo';
```

Each tool card uses a theme color for visual distinction.

---

## 🔒 Security Architecture

### XSS Prevention

All composables use DOM APIs instead of innerHTML:

```typescript
// ✅ Safe - using textContent
const div = document.createElement('div');
div.textContent = userInput;

// ❌ Unsafe - using innerHTML
element.innerHTML = userInput;
```

### Content Security Policy

Configured in `astro.config.mjs`:
- Restrict script sources
- Prevent inline scripts
- Control frame ancestors

### File Processing

- Files processed entirely in-browser using:
  - PDF.js for PDF manipulation
  - Canvas API for image processing
  - File API for file access
- No upload to external servers

---

## 📱 PWA Architecture

### Service Worker Strategy

- **Precache**: Static assets (HTML, CSS, JS)
- **Runtime cache**: CDN libraries
- **Offline support**: Full functionality offline

### Manifest

Configured in `astro.config.mjs`:
- App name and icons
- Theme colors
- Display mode (standalone)
- Orientation (any)

### Update Flow

1. Service worker checks for updates
2. User sees "Update Available" notification
3. User chooses to update or dismiss
4. New version installed on next visit

---

## 🧪 Testing Architecture

### Unit Tests (Vitest)

```
src/tests/
├── setup.ts           # Global test setup and mocks
└── composables/
    ├── useToast.test.ts
    ├── useClipboard.test.ts
    └── useFileHandler.test.ts
```

### E2E Tests (Playwright)

```
e2e/
└── homepage.spec.ts   # Homepage functionality tests
```

### Test Commands

```bash
pnpm test           # Run all unit tests
pnpm test:e2e       # Run E2E tests
```

---

## ⚡ Performance Architecture

### Code Splitting

- Each tool page loads its specific logic
- Shared composables are code-split
- Lazy loading for heavy libraries (PDF.js, etc.)

### Caching Strategy

- Service worker precaching for instant loads
- CDN caching for static assets
- Local storage for user preferences

### Optimization Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Blocking Time | < 200ms |
| Cumulative Layout Shift | < 0.1 |

---

## 🔮 Future Architecture Considerations

### Plugin System (Planned)

```typescript
interface ToolPlugin {
  id: string;
  name: string;
  init: () => void;
  execute: (input: unknown) => unknown;
}
```

### WebAssembly Processors (Planned)

For performance-critical operations:
- Image processing
- PDF manipulation
- Encryption/hashing

### IndexedDB Storage (Planned)

- Offline data persistence
- Tool history and favorites
- Cached results for repeat operations

---

## 📊 File Summary

| Path | Purpose | Lines (approx) |
|------|---------|----------------|
| `src/pages/index.astro` | Homepage with tool categories | ~200 |
| `src/layouts/BaseLayout.astro` | Main layout with all features | ~500 |
| `src/components/ToolCard.astro` | Tool card component | ~60 |
| `src/composables/useToast.ts` | Toast notifications | ~100 |
| `src/composables/useFileHandler.ts` | File drag/drop handling | ~80 |
| `src/composables/useClipboard.ts` | Clipboard operations | ~60 |
| `src/composables/useProgress.ts` | Progress bars | ~100 |
| `src/lib/registry.ts` | Tool registry | ~300 |
| `src/types/tool.ts` | TypeScript types | ~150 |
| `src/i18n/translations.ts` | Translations | ~500+ |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 4.x |
| Styling | Tailwind CSS |
| Language | TypeScript (strict) |
| Testing | Vitest + Playwright |
| PWA | Vite PWA Plugin |
| CDN | cdnjs, jsdelivr |

---

**Last updated:** June 2024  
**Maintained by:** Aulia Iskandar Lubis