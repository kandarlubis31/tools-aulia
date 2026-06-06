# Contributing to ToolsAulia

Thank you for your interest in contributing to ToolsAulia! This is a client-side only tool collection built with Astro. We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kandarlubis31/tools-aulia.git
cd tools-aulia

# Install dependencies (uses pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🛠️ Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **pnpm** v8 or higher (we use pnpm, not npm or yarn)

### Environment

```bash
# Clone and install
git clone https://github.com/kandarlubis31/tools-aulia.git
cd tools-aulia
pnpm install

# Copy environment file (if needed)
cp .env.example .env
```

### Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server (http://localhost:4321) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run Vitest unit tests |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm lint` | Run ESLint |

## 📁 Project Structure

```
tools-aulia/
├── src/
│   ├── components/       # Astro components (ToolCard, etc.)
│   ├── composables/      # Reusable logic (useToast, useFileHandler, etc.)
│   ├── i18n/             # Translation files
│   ├── layouts/          # BaseLayout and other layouts
│   ├── lib/              # Registry and utilities
│   ├── pages/            # Tool pages organized by category
│   │   ├── calc/         # Calculator tools (age, BMI, currency, etc.)
│   │   ├── dev/          # Developer tools (JSON, base64, cron, etc.)
│   │   ├── file/         # File manipulation tools
│   │   ├── image/        # Image processing tools
│   │   ├── pdf/          # PDF tools (merge, compress, split, etc.)
│   │   ├── security/     # Security tools (hash, password, UUID)
│   │   └── utils/        # Utility tools (QR, stopwatch, todo, etc.)
│   ├── styles/           # Global CSS styles
│   ├── tests/            # Unit tests
│   └── types/            # TypeScript type definitions
├── e2e/                  # Playwright E2E tests
├── public/               # Static assets
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind CSS configuration
├── vitest.config.ts      # Vitest configuration
└── playwright.config.ts  # Playwright configuration
```

## 🎨 Making Changes

### Adding a New Tool

1. **Create a new page** in the appropriate category under `src/pages/`:
   ```astro
   ---
   // src/pages/[category]/my-tool.astro
   ---
   <script>
     // Your tool logic here
   </script>
   
   <BaseLayout>
     <main>
       <!-- Your tool UI here -->
     </main>
   </BaseLayout>
   ```

2. **Use the composables** for common functionality:
   ```astro
   <script>
     import { useToast } from '../../composables/useToast';
     import { useFileHandler } from '../../composables/useFileHandler';
     
     const toast = useToast();
     const { createDropZone } = useFileHandler();
   </script>
   ```

3. **Add i18n translations** in `src/i18n/translations.ts`

4. **Add to tool registry** in `src/lib/registry.ts`

### Coding Standards

- **TypeScript**: Use strict typing, avoid `any`
- **Naming**: Use descriptive names, follow existing conventions
- **Comments**: Document complex logic
- **Formatting**: Prettier handles this automatically

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests
pnpm test

# Run with UI
pnpm test:ui

# Watch mode
pnpm test:watch
```

Tests are located in `src/tests/composables/` and should follow the pattern:
- `useToast.test.ts`
- `useClipboard.test.ts`
- `useFileHandler.test.ts`

### E2E Tests (Playwright)

```bash
# Install browsers (first time only)
pnpm playwright install

# Run E2E tests
pnpm test:e2e

# Open Playwright UI
pnpm playwright test --ui
```

E2E tests are in `e2e/` directory.

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
git commit -m "feat(pdf): add PDF merge tool"
git commit -m "fix(useToast): resolve type extraction bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "test(composables): add useClipboard unit tests"
```

## 🔄 Pull Request Process

1. **Fork** the repository
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/my-new-tool
   ```
3. **Make your changes** following the coding standards
4. **Add tests** for new functionality
5. **Ensure all tests pass**:
   ```bash
   pnpm typecheck
   pnpm test
   pnpm test:e2e
   ```
6. **Commit** using conventional commits
7. **Push** to your fork
8. **Open a Pull Request** with:
   - Clear description of the change
   - Link to related issues
   - Screenshots for UI changes

### PR Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Testing

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed self-review of my code
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] All tests pass locally
- [ ] I have documented new functionality
```

## 📖 Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## 🤝 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Feel free to open an issue or reach out to the maintainers.