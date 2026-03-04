#!/usr/bin/env bun

/**
 * RSS Feed Generator
 *
 * Generates an RSS feed from blog posts.
 *
 * Usage:
 *   bun run scripts/generate-rss.ts
 *   bun run scripts/generate-rss.ts --content ./content/posts --output ./public/rss.xml
 */

import { Feed } from 'feed'
import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, basename, dirname } from 'path'

const DEFAULT_CONTENT = './content/posts'
const DEFAULT_OUTPUT = './public/rss.xml'

interface PostMeta {
  title: string
  slug: string
  date: string
  excerpt: string
  author?: string
  draft?: boolean
}

async function extractFrontmatter(content: string): Promise<Record<string, string>> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter: Record<string, string> = {}
  const lines = match[1].split('\n')

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '')
      frontmatter[key.trim()] = value
    }
  }

  return frontmatter
}

async function getPosts(contentDir: string): Promise<PostMeta[]> {
  try {
    const entries = await readdir(contentDir, { withFileTypes: true })
    const posts: PostMeta[] = []

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue

      const filePath = join(contentDir, entry.name)
      const content = await readFile(filePath, 'utf-8')
      const frontmatter = await extractFrontmatter(content)

      // Skip drafts
      if (frontmatter.draft === 'true') continue

      const slug = frontmatter.slug || basename(entry.name, '.mdx')

      posts.push({
        title: frontmatter.title || slug,
        slug,
        date: frontmatter.date || new Date().toISOString(),
        excerpt: frontmatter.excerpt || '',
        author: frontmatter.author,
        draft: frontmatter.draft === 'true',
      })
    }

    // Sort by date (newest first)
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
}

async function generateFeed(
  contentDir: string,
  outputPath: string,
  siteUrl = 'https://example.com',
  siteName = 'My Site'
): Promise<void> {
  console.log(`\n📰 Generating RSS Feed\n`)
  console.log(`Content: ${contentDir}`)
  console.log(`Output:  ${outputPath}\n`)

  const posts = await getPosts(contentDir)

  if (posts.length === 0) {
    console.log('No posts found.')
    return
  }

  const feed = new Feed({
    title: siteName,
    description: `Latest posts from ${siteName}`,
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${siteName}`,
    updated: new Date(posts[0].date),
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
    },
    author: {
      name: siteName,
      link: siteUrl,
    },
  })

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${siteUrl}/blog/${post.slug}/`,
      link: `${siteUrl}/blog/${post.slug}/`,
      description: post.excerpt,
      date: new Date(post.date),
      author: post.author
        ? [{ name: post.author }]
        : undefined,
    })

    console.log(`  ✓ ${post.slug}`)
  }

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true })

  await writeFile(outputPath, feed.rss2())

  console.log(`\n✅ Generated RSS feed with ${posts.length} items`)
  console.log(`   Output: ${outputPath}\n`)
}

// Parse CLI arguments
const args = process.argv.slice(2)
const contentIndex = args.indexOf('--content')
const outputIndex = args.indexOf('--output')

const contentDir = contentIndex !== -1 ? args[contentIndex + 1] : DEFAULT_CONTENT
const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : DEFAULT_OUTPUT

generateFeed(contentDir, outputPath).catch(console.error)
