# Performance Optimization

> **Last Updated**: March 2026

## Core Web Vitals Targets

| Metric | Target (p75) | Description |
|--------|--------------|-------------|
| LCP | < 2.0s | Largest Contentful Paint |
| INP | < 200ms | Interaction to Next Paint |
| CLS | < 0.1 | Cumulative Layout Shift |

## Bundle Budget

- Homepage JS: **< 180KB gzip** (excluding Next.js runtime)
- Hero images: **< 150KB** (mobile), AVIF preferred

## Image Optimization

### Build-Time Processing

```typescript
// scripts/optimize-images.ts
import sharp from 'sharp'

async function optimizeImage(inputPath: string, outputDir: string) {
  const sizes = [640, 750, 828, 1080, 1200]

  for (const width of sizes) {
    await sharp(inputPath)
      .resize(width)
      .avif({ quality: 80 })
      .toFile(`${outputDir}/image-${width}.avif`)

    await sharp(inputPath)
      .resize(width)
      .webp({ quality: 85 })
      .toFile(`${outputDir}/image-${width}.webp`)
  }
}
```

### Responsive Images

```tsx
<picture>
  <source
    type="image/avif"
    srcSet="/images/hero-640.avif 640w, /images/hero-1200.avif 1200w"
  />
  <source
    type="image/webp"
    srcSet="/images/hero-640.webp 640w, /images/hero-1200.webp 1200w"
  />
  <img
    src="/images/hero.jpg"
    alt="Hero image"
    loading="eager"
    decoding="async"
  />
</picture>
```

## Lazy Loading

```typescript
import dynamic from 'next/dynamic'

// Dynamic imports for heavy components
const ROICalculator = dynamic(
  () => import('@/components/features/roi-calculator'),
  { loading: () => <Skeleton className="h-96" /> }
)

// Client-only components
const CalendlyEmbed = dynamic(
  () => import('@/components/features/calendly-embed'),
  { ssr: false }
)
```

## Font Loading

```typescript
// app/layout.tsx
import { GeistSans, GeistMono } from 'geist/font'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

## Web Vitals Monitoring

```typescript
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to your analytics
    fetch('/api/rum', {
      method: 'POST',
      body: JSON.stringify({
        name: metric.name,
        value: Math.round(metric.value),
        id: metric.id,
      }),
    })
  })
  return null
}
```

## Caching Strategy

| Asset Type | Cache Control |
|------------|--------------|
| Static assets | `max-age=31536000, immutable` |
| HTML pages | `max-age=0, must-revalidate` |
| API responses | `max-age=60, stale-while-revalidate=600` |

## References

- [web.dev Core Web Vitals](https://web.dev/vitals/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
