# Next.js 16 & React 19

> **Last Updated**: March 2026

## Breaking Changes from Next.js 15

1. **Async Request APIs are mandatory** - `cookies()`, `headers()`, `params`, `searchParams` must be awaited
2. **Turbopack is default** - no `--turbopack` flag needed
3. **`middleware.ts` renamed to `proxy.ts`** - export function named `proxy`
4. **React Compiler is stable** - enable in config
5. **`next lint` removed** - use ESLint CLI directly

## Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',           // Static export for Cloudflare Pages

  images: {
    unoptimized: true,        // Required for static export
  },

  trailingSlash: true,        // Better Cloudflare Pages compatibility

  reactCompiler: true,        // Stable in Next.js 16

  turbopack: {
    // Turbopack options (now top-level, not experimental)
  },

  experimental: {
    typedRoutes: true,        // Type-safe <Link>
  },
}

export default nextConfig
```

## Async Dynamic APIs

```typescript
// Next.js 16 - MUST await params and searchParams
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const query = await props.searchParams
  return <h1>{slug}</h1>
}
```

## Server Components (Default)

```typescript
// Server Component - fetches data directly
export default async function ProjectsPage() {
  const projects = await getProjects()  // Direct async/await
  return <ProjectList projects={projects} />
}
```

## Client Components

```typescript
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

## React 19 Features

- **No React import needed** for JSX
- **`use()` hook** to unwrap promises in components
- **`useActionState`** replaces `useFormState`
- **View Transitions** for navigation animations
- **Activity** for background rendering

## Type Generation

```bash
# Generate typed route helpers
npx next typegen
```

This creates `PageProps`, `LayoutProps`, `RouteContext` helpers for type-safe params.

## References

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 Deep Dive](https://medium.com/@rtsekov/next-js-16-deep-dive-performance-caching-the-future-of-react-apps-76c1e55c583a)
- [React & Next.js 2026 Best Practices](https://fabwebstudio.com/blog/react-nextjs-best-practices-2026-performance-scale)
