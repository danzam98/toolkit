# Best Practices

Authoritative guides for modern web development with Next.js 16, Tailwind v4, and the modern React ecosystem.

## Guides

### Core Stack

| Guide | Description |
|-------|-------------|
| [Next.js 16](nextjs-16.md) | App Router, Server Components, async APIs, React Compiler |
| [Tailwind CSS v4](tailwind-v4.md) | CSS-first `@theme` configuration, migration from v3 |
| [shadcn/ui](shadcn-ui.md) | Component organization, design tokens, accessibility |
| [TypeScript](typescript.md) | Strict mode configuration, type patterns |
| [Motion Animations](motion-animations.md) | Motion library patterns, reduced motion support |

### Deployment & Operations

| Guide | Description |
|-------|-------------|
| [Cloudflare Pages](cloudflare-pages.md) | Static export, Functions, security headers |
| [Testing](testing.md) | Vitest unit tests, Playwright E2E |
| [CI/CD](ci-cd.md) | GitHub Actions, Dependabot, pre-commit hooks |
| [Security](security.md) | Headers, Turnstile, rate limiting, OWASP |
| [Performance](performance.md) | Core Web Vitals, bundle budgets, image optimization |
| [SEO](seo.md) | Metadata API, structured data, sitemaps |
| [Troubleshooting](troubleshooting.md) | Common issues and solutions |

## Version Requirements

| Package | Version |
|---------|---------|
| Node.js | 20.9+ |
| Bun | 1.x |
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.1+ |
| Tailwind CSS | 4.x |

## Quick Reference

### Commands

```bash
bun dev          # Start dev server
bun build        # Build for production
bun lint         # Run ESLint
bun typecheck    # TypeScript check
bun test         # Run unit tests
bun test:e2e     # Run E2E tests
```

### Key Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `src/app/globals.css` | Tailwind @theme tokens |
| `src/lib/constants.ts` | Site configuration |
| `src/lib/animations.ts` | Motion variants |
| `public/_headers` | Security headers |
| `wrangler.toml` | Cloudflare config |
