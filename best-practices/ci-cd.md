# CI/CD

> **Last Updated**: March 2026

## GitHub Actions

### CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test
      - run: bun run build

      # Bundle size check
      - run: bun run size-limit

      # Lighthouse CI (on preview deploys)
      - uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
```

## Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      production-dependencies:
        patterns:
          - "*"
```

## Pre-commit Hooks

### Setup

```bash
bunx husky init
```

### Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### Hook

```bash
# .husky/pre-commit
bunx lint-staged
```

## Branch Strategy

- `main` - Production
- `develop` - Integration
- `feature/*` - Feature branches

## Branch Protection

Configure on GitHub:

1. Require CI pass
2. No force push to main
3. Require pull request reviews

## Bundle Size Monitoring

```json
// package.json
{
  "size-limit": [
    {
      "path": "out/**/*.js",
      "limit": "180 KB"
    }
  ]
}
```

## Scheduled Jobs

### Cache Refresh

```yaml
# .github/workflows/sync-cache.yml
name: Refresh Cache

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run scripts/sync-github.ts
      - uses: peter-evans/create-pull-request@v6
        with:
          title: 'chore: refresh GitHub cache'
          branch: chore/refresh-cache
```
