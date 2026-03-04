# SEO & Metadata

> **Last Updated**: March 2026

## Metadata API

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://example.com'),
  title: {
    default: 'My Site',
    template: '%s | My Site',
  },
  description: 'Site description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'My Site',
    images: ['/og/default.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

## Per-Page Metadata

```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [`/og/${slug}.png`],
    },
  }
}
```

## Structured Data (JSON-LD)

### Organization

```typescript
export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'My Organization',
          url: 'https://example.com',
          logo: 'https://example.com/logo.png',
        }),
      }}
    />
  )
}
```

### Article

```typescript
export function ArticleJsonLd({ post }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          datePublished: post.date,
          author: {
            '@type': 'Person',
            name: post.author,
          },
        }),
      }}
    />
  )
}
```

### Breadcrumbs

```typescript
export function BreadcrumbJsonLd({ items }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }),
      }}
    />
  )
}
```

## Sitemap

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  return [
    { url: 'https://example.com', lastModified: new Date() },
    { url: 'https://example.com/about', lastModified: new Date() },
    ...posts.map((post) => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ]
}
```

## Robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/thanks/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

## RSS Feed

Generate at build time:

```typescript
// scripts/generate-rss.ts
import { Feed } from 'feed'
import { writeFile } from 'fs/promises'

const feed = new Feed({
  title: 'My Blog',
  description: 'Latest posts',
  id: 'https://example.com',
  link: 'https://example.com',
  language: 'en',
})

posts.forEach((post) => {
  feed.addItem({
    title: post.title,
    id: post.slug,
    link: `https://example.com/blog/${post.slug}`,
    date: new Date(post.date),
  })
})

await writeFile('./public/rss.xml', feed.rss2())
```

## References

- [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
