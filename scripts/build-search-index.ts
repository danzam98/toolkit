#!/usr/bin/env bun

/**
 * Search Index Builder
 *
 * Generates a JSON search index from content files.
 *
 * Usage:
 *   bun run scripts/build-search-index.ts
 *   bun run scripts/build-search-index.ts --content ./content --output ./public/search-index.json
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, basename, dirname } from 'path'

const DEFAULT_CONTENT = './content'
const DEFAULT_OUTPUT = './public/search-index.json'

interface SearchDocument {
  id: string
  title: string
  slug: string
  type: string
  excerpt: string
  content: string
  url: string
}

interface SearchIndex {
  documents: SearchDocument[]
  generatedAt: string
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

function stripMarkdown(content: string): string {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

function generateExcerpt(content: string, maxLength = 200): string {
  const stripped = stripMarkdown(content)
  if (stripped.length <= maxLength) return stripped
  return stripped.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

async function getMdxFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    const files: string[] = []

    for (const entry of entries) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await getMdxFiles(path)))
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        files.push(path)
      }
    }

    return files
  } catch {
    return []
  }
}

function getTypeFromPath(filePath: string, contentDir: string): string {
  const relativePath = filePath.replace(contentDir + '/', '')
  const parts = relativePath.split('/')
  return parts[0] || 'page'
}

function getUrlFromPath(filePath: string, contentDir: string): string {
  const relativePath = filePath.replace(contentDir + '/', '')
  const slug = basename(relativePath, '.mdx').replace('.md', '')
  const type = getTypeFromPath(filePath, contentDir)

  // Map content types to URL paths
  const urlMap: Record<string, string> = {
    posts: '/blog',
    guides: '/guides',
    projects: '/projects',
    playbooks: '/playbooks',
  }

  const basePath = urlMap[type] || `/${type}`
  return `${basePath}/${slug}/`
}

async function buildIndex(contentDir: string, outputPath: string): Promise<void> {
  console.log(`\n🔍 Building Search Index\n`)
  console.log(`Content: ${contentDir}`)
  console.log(`Output:  ${outputPath}\n`)

  const files = await getMdxFiles(contentDir)

  if (files.length === 0) {
    console.log('No content files found.')
    return
  }

  console.log(`Found ${files.length} content files:\n`)

  const documents: SearchDocument[] = []

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8')
    const frontmatter = await extractFrontmatter(content)

    const slug = frontmatter.slug || basename(filePath, '.mdx').replace('.md', '')
    const type = getTypeFromPath(filePath, contentDir)

    // Skip drafts
    if (frontmatter.draft === 'true') {
      console.log(`  ⏭ ${slug} (draft)`)
      continue
    }

    const doc: SearchDocument = {
      id: `${type}/${slug}`,
      title: frontmatter.title || slug,
      slug,
      type,
      excerpt: frontmatter.excerpt || generateExcerpt(content),
      content: stripMarkdown(content).slice(0, 5000), // Limit content size
      url: getUrlFromPath(filePath, contentDir),
    }

    documents.push(doc)
    console.log(`  ✓ ${doc.id}`)
  }

  const index: SearchIndex = {
    documents,
    generatedAt: new Date().toISOString(),
  }

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true })

  await writeFile(outputPath, JSON.stringify(index, null, 2))

  console.log(`\n✅ Generated index with ${documents.length} documents`)
  console.log(`   Output: ${outputPath}\n`)
}

// Parse CLI arguments
const args = process.argv.slice(2)
const contentIndex = args.indexOf('--content')
const outputIndex = args.indexOf('--output')

const contentDir = contentIndex !== -1 ? args[contentIndex + 1] : DEFAULT_CONTENT
const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : DEFAULT_OUTPUT

buildIndex(contentDir, outputPath).catch(console.error)
