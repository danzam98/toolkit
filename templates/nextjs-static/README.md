# {{BRAND_NAME}}

{{DESCRIPTION}}

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.x

### Installation

```bash
# Install dependencies
bun install

# Run setup script (optional, for placeholder replacement)
bun run scripts/setup.ts

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production (static export) |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun typecheck` | Run TypeScript type checking |
| `bun test` | Run unit tests |
| `bun test:e2e` | Run end-to-end tests |
| `bun format` | Format code with Prettier |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (`motion/react`)
- **Fonts**: Geist (sans + mono)
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── ui/           # Base UI components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── lib/              # Utilities and helpers
└── styles/           # Global styles

public/               # Static assets
functions/            # Cloudflare Pages Functions
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

## Troubleshooting

See the [troubleshooting guide](../../best-practices/troubleshooting.md) for solutions to common issues with:
- Tailwind CSS v4 configuration
- Static export errors
- Cloudflare deployment
- TypeScript strict mode
- Motion/animation problems

## License

MIT
