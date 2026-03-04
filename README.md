# Toolkit

A comprehensive toolkit for scaffolding production-ready Next.js projects with modern best practices.

## Quick Start

### Option 1: Clone a template directly

```bash
# Clone the Next.js static export template
npx degit danzam98/toolkit/templates/nextjs-static my-project

# Install and run
cd my-project
bun install
bun dev
```

### Option 2: Interactive CLI (coming soon)

```bash
bun create danzam98/toolkit my-project
```

## What's Included

### `/templates`

Ready-to-use project scaffolds:

| Template | Description |
|----------|-------------|
| `nextjs-static` | Next.js 16 + Tailwind v4 + shadcn/ui + Cloudflare Pages |

### `/best-practices`

Authoritative guides for modern web development:

| Guide | Topics |
|-------|--------|
| [nextjs-16.md](best-practices/nextjs-16.md) | Next.js 16 + React 19 patterns, async APIs, Server Components |
| [tailwind-v4.md](best-practices/tailwind-v4.md) | CSS-first `@theme` configuration, migration from v3 |
| [shadcn-ui.md](best-practices/shadcn-ui.md) | Component organization, design tokens, accessibility |
| [typescript.md](best-practices/typescript.md) | Strict mode, type patterns, configuration |
| [cloudflare-pages.md](best-practices/cloudflare-pages.md) | Static export, Functions, deployment |
| [testing.md](best-practices/testing.md) | Vitest + Playwright patterns |
| [ci-cd.md](best-practices/ci-cd.md) | GitHub Actions workflows |
| [security.md](best-practices/security.md) | Headers, Turnstile, rate limiting |
| [performance.md](best-practices/performance.md) | Core Web Vitals, bundle budgets |
| [seo.md](best-practices/seo.md) | Metadata, structured data, sitemaps |
| [motion-animations.md](best-practices/motion-animations.md) | Motion library patterns |

### `/governance`

Rules for AI agents working on projects:

| File | Purpose |
|------|---------|
| [AGENTS.md](governance/AGENTS.md) | Critical rules for file deletion, git safety, code discipline |
| [code-style.md](governance/code-style.md) | Formatting and naming conventions |
| [review-checklist.md](governance/review-checklist.md) | Pre-commit verification steps |

### `/scripts`

Reusable build and automation scripts:

| Script | Description |
|--------|-------------|
| `optimize-images.ts` | Generate AVIF/WebP responsive images |
| `build-search-index.ts` | Build client-side search index |
| `generate-rss.ts` | Generate RSS feed from MDX content |
| `sync-github-stats.ts` | Fetch repository stars/activity |
| `validate-links.ts` | Check for broken links |

### `/configs`

Standalone configuration files for existing projects:

| Config | Description |
|--------|-------------|
| `tsconfig.json` | TypeScript strict mode |
| `eslint.config.js` | ESLint flat config |
| `.prettierrc` | Prettier defaults |
| `vitest.config.ts` | Vitest + React setup |
| `playwright.config.ts` | E2E testing |
| `wrangler.toml` | Cloudflare Pages |

### `/cli`

Interactive scaffold CLI tool (Phase 2).

## For AI Agents

When working on projects scaffolded from this toolkit:

1. **Read the relevant best-practices guides** before making changes
2. **Follow governance/AGENTS.md** - especially the file deletion and git safety rules
3. **Use the review checklist** before committing

### Referencing from Projects

Add to your project's `CLAUDE.md`:

```markdown
## Reference

Best practices: https://github.com/danzam98/toolkit/tree/main/best-practices
Agent rules: https://github.com/danzam98/toolkit/blob/main/governance/AGENTS.md
```

## Tech Stack

Templates are built with:

- **Runtime**: Bun 1.x (enforced via `.npmrc`)
- **Framework**: Next.js 16 (App Router, static export)
- **UI**: React 19, TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Animation**: Motion (`motion/react`)
- **Fonts**: Geist (sans + mono)
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages
- **Testing**: Vitest (unit), Playwright (E2E)

## Contributing

1. Update templates in `/templates`
2. Update corresponding docs in `/best-practices`
3. Test with `degit` before committing

## License

MIT
