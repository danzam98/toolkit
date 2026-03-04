# Troubleshooting

Common issues and solutions for Next.js 16 + Tailwind v4 projects.

*Last updated: March 2026*

## Tailwind CSS v4 Issues

### CSS not applying

**Symptom:** Tailwind classes render but styles don't appear.

**Solution:** Check your main CSS file imports Tailwind correctly:

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* your tokens */
}
```

**v4 change:** The old `@tailwind base/components/utilities` directives are replaced with a single `@import "tailwindcss"`.

### @theme variables not recognized

**Symptom:** Editor shows errors for `@theme` blocks or CSS variables like `--color-primary`.

**Solution:**
1. Update your editor's CSS extension (VS Code Tailwind CSS IntelliSense v0.12+)
2. Ensure `tailwindcss` v4.x is installed: `bun add tailwindcss@latest`
3. If using PostCSS, ensure `postcss.config.mjs` uses the v4 plugin:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Migration from v3 class names

**Changed classes in v4:**

| v3 | v4 |
|----|-----|
| `bg-opacity-50` | `bg-black/50` (use slash syntax) |
| `text-opacity-75` | `text-white/75` |
| `ring-offset-2` | Use `outline` or `box-shadow` |
| `divide-opacity-*` | Use slash syntax |

**Run the migration tool:**

```bash
bunx @tailwindcss/upgrade
```

---

## Static Export Errors

### "Image Optimization requires a different loader"

**Symptom:** Build fails when using `next/image` with `output: 'export'`.

**Solution:** Use `unoptimized` for static exports:

```tsx
// Option 1: Per-image
<Image src="/photo.jpg" alt="" width={800} height={600} unoptimized />

// Option 2: Global in next.config.ts
const config: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}
```

### Dynamic routes without generateStaticParams

**Symptom:** `Error: Page "/blog/[slug]" is missing "generateStaticParams()"`

**Solution:** Export `generateStaticParams` from every dynamic route:

```tsx
// src/app/blog/[slug]/page.tsx
export function generateStaticParams() {
  return [
    { slug: 'hello-world' },
    { slug: 'second-post' },
  ]
}
```

If you need truly dynamic routes, you cannot use static export. Consider Cloudflare Functions or server-side rendering.

### API routes not supported in static export

**Symptom:** `Error: API Routes cannot be used with "output: export"`

**Solution:** Move API logic to:
1. **Cloudflare Pages Functions** (`functions/api/route.ts`)
2. **External API** (separate backend service)
3. **Client-side calls** to third-party APIs

---

## Cloudflare Deployment

### Build command and output directory

**Cloudflare Pages settings:**

| Setting | Value |
|---------|-------|
| Build command | `bun run build` |
| Output directory | `out` |
| Node.js version | 20 or later |

### Functions not found

**Symptom:** `/api/contact` returns 404 even though `functions/api/contact.ts` exists.

**Solutions:**
1. Ensure file is at `functions/api/contact.ts` (not `pages/api/` or `src/functions/`)
2. Export a proper handler:

```ts
// functions/api/contact.ts
export const onRequestPost: PagesFunction = async ({ request }) => {
  const data = await request.json()
  return Response.json({ success: true })
}
```

3. Check `wrangler.toml` doesn't exclude the path

### Environment variables not available

**Symptom:** `process.env.MY_VAR` is undefined at runtime.

**Solution:** Cloudflare uses a different env pattern:

```ts
// In Functions, access via context
export const onRequest: PagesFunction<Env> = async ({ env }) => {
  const apiKey = env.MY_API_KEY // Set in Cloudflare dashboard
  return Response.json({ key: apiKey })
}
```

For build-time variables, prefix with `NEXT_PUBLIC_`:
```
NEXT_PUBLIC_SITE_URL=https://example.com
```

---

## TypeScript Strict Mode

### "Object is possibly undefined"

**Symptom:** `TS18048: 'user' is possibly 'undefined'`

**Solutions:**

```tsx
// Option 1: Optional chaining
const name = user?.name

// Option 2: Nullish coalescing
const name = user?.name ?? 'Guest'

// Option 3: Type guard
if (user) {
  console.log(user.name) // user is defined here
}

// Option 4: Non-null assertion (use sparingly)
const name = user!.name // Only if you're 100% certain
```

### Implicit any errors

**Symptom:** `TS7006: Parameter 'item' implicitly has an 'any' type`

**Solution:** Add explicit types:

```tsx
// Before
items.map(item => item.name)

// After
items.map((item: Product) => item.name)

// Or use inference
const items: Product[] = []
items.map(item => item.name) // item is Product
```

### Third-party library type issues

**Symptom:** `TS7016: Could not find a declaration file for module 'some-lib'`

**Solutions:**

```bash
# 1. Install community types
bun add -D @types/some-lib

# 2. If no types exist, create a declaration file
# src/types/some-lib.d.ts
declare module 'some-lib' {
  export function doThing(): void
}
```

---

## Motion/Animation Issues

### "Cannot use import statement outside a module"

**Symptom:** Error when importing from `motion/react`.

**Solution:** Ensure `motion` is installed correctly:

```bash
bun add motion
```

Import from `motion/react`:
```tsx
import { motion, AnimatePresence } from 'motion/react'
```

### SSR hydration mismatch

**Symptom:** Warning about content not matching between server and client.

**Solution:** Disable animations on initial render or use `useEffect`:

```tsx
'use client'

import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

export function AnimatedComponent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div>Content</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Content
    </motion.div>
  )
}
```

### Reduced motion not working

**Symptom:** Animations play even with `prefers-reduced-motion` enabled.

**Solution:** Use the hook from our animation utilities:

```tsx
import { useReducedMotion } from '@/lib/animations'

export function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

Or use the `motion` `reducedMotion` prop:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.3,
    reducedMotion: 'user' // Respects system preference
  }}
>
```

---

## Still Stuck?

1. Search existing issues in the toolkit repo
2. Check the [best-practices guides](./README.md) for detailed patterns
3. Open a new issue with:
   - Error message (full stack trace)
   - Minimal reproduction steps
   - Your environment (Node version, Bun version, OS)
