# Motion Animations

> **Note**: Framer Motion has been rebranded to **Motion** (`motion/react`)

## Installation

```bash
bun add motion
```

## Basic Usage

```typescript
'use client'

import { motion } from 'motion/react'

export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

## Animation Variants (Centralized)

```typescript
// lib/animations.ts
import { Variants } from 'motion/react'

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}
```

## Reduced Motion Support

**Critical**: Always respect `prefers-reduced-motion`:

```typescript
'use client'

import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  return prefersReducedMotion
}
```

### Usage

```typescript
'use client'

import { motion } from 'motion/react'
import { useReducedMotion, fadeInUp, fadeIn } from '@/lib/animations'

export function AnimatedSection({ children }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={prefersReducedMotion ? fadeIn : fadeInUp}
    >
      {children}
    </motion.section>
  )
}
```

## Server Component Integration

Motion components need `'use client'`. Extract only animated sections:

```typescript
// page.tsx (Server Component)
export default async function Page() {
  const data = await getData()  // Server-side fetch
  return <AnimatedSection data={data} />  // Client Component
}

// AnimatedSection.tsx
'use client'
import { motion } from 'motion/react'

export function AnimatedSection({ data }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* content */}
    </motion.section>
  )
}
```

## Exit Animations

```typescript
'use client'

import { AnimatePresence, motion } from 'motion/react'

export function Modal({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Performance Tips

- Use `whileTap` and `whileHover` instead of custom event handlers
- Add `layoutScroll` to scrollable ancestors for layout animations
- Use `useInView` for viewport-triggered animations
- Motion uses Web Animations API for 120fps performance

## References

- [Motion for React Docs](https://motion.dev/docs/react)
- [Motion Performance Tips](https://tillitsdone.com/blogs/framer-motion-performance-tips/)
