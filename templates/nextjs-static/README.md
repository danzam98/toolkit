# {{BRAND_NAME}}

> {{DESCRIPTION}}

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![Deploy: Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020)](https://pages.cloudflare.com/)

## Overview

{{OVERVIEW}}

**Domain:** {{DOMAIN}}

## Features

- Feature 1 — description
- Feature 2 — description
- Feature 3 — description

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), static export |
| UI | React 19, TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Animation | Motion (`motion/react`) |
| Typography | Geist (sans + mono) |
| Icons | Lucide React |
| Deployment | Cloudflare Pages |

## Quick Start

```bash
# Install dependencies
bun install

# Run setup script (replaces placeholders)
bun run scripts/setup.ts

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production (static export) |
| `bun run lint` | Run ESLint |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run test` | Run unit tests |
| `bun run test:e2e` | Run end-to-end tests |

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   └── features/     # Feature-specific components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── functions/            # Cloudflare Pages Functions
├── AGENTS.md             # AI agent governance rules
└── README.md             # This file
```

## Configuration

Create `.env.local` for local development:

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudflare Turnstile (if using forms)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `bun run build`
3. Set output directory: `out`

Or deploy manually:

```bash
bun run build
bunx wrangler pages deploy out
```

## Issue Tracking

This project uses [beads_rust](https://github.com/Dicklesworthstone/beads_rust) for issue tracking:

```bash
br ready --json    # Show available tasks
br create "Task"   # Create new issue
br close br-1      # Complete task
```

## Contributing

1. Check `br ready --json` for available tasks
2. Claim a task: `br update <id> --status in_progress`
3. Make changes, run `bun run typecheck && bun run lint`
4. Commit and push immediately
5. Close task: `br close <id> --reason "Description"`

## Troubleshooting

See the [troubleshooting guide](https://github.com/danzam98/toolkit/blob/main/best-practices/troubleshooting.md) for solutions to common issues.

## License

MIT

## Credits

- Scaffolded with [danzam98/toolkit](https://github.com/danzam98/toolkit)
- Issue tracking via [beads_rust](https://github.com/Dicklesworthstone/beads_rust) by [Jeffrey Emanuel](https://github.com/Dicklesworthstone)
