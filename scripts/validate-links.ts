#!/usr/bin/env bun

/**
 * Link Validator
 *
 * Checks for broken internal and external links.
 *
 * Usage:
 *   bun run scripts/validate-links.ts
 *   bun run scripts/validate-links.ts --dir ./out --external
 */

import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'
import * as cheerio from 'cheerio'

const DEFAULT_DIR = './out'

interface LinkResult {
  url: string
  source: string
  status: 'ok' | 'broken' | 'error'
  statusCode?: number
  error?: string
}

async function getHtmlFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    const files: string[] = []

    for (const entry of entries) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await getHtmlFiles(path)))
      } else if (extname(entry.name) === '.html') {
        files.push(path)
      }
    }

    return files
  } catch {
    return []
  }
}

function extractLinks(html: string, filePath: string): { internal: string[]; external: string[] } {
  const $ = cheerio.load(html)
  const internal: string[] = []
  const external: string[] = []

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href) return

    // Skip anchors, mailto, tel, javascript
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      return
    }

    if (href.startsWith('http://') || href.startsWith('https://')) {
      external.push(href)
    } else {
      internal.push(href)
    }
  })

  return { internal, external }
}

async function checkInternalLink(
  link: string,
  htmlFiles: string[],
  baseDir: string
): Promise<LinkResult['status']> {
  // Normalize the link
  let normalized = link.replace(/^\//, '').replace(/\/$/, '')
  if (!normalized) normalized = 'index'
  if (!normalized.endsWith('.html')) normalized += '/index'

  // Check if file exists
  const possiblePaths = [
    join(baseDir, normalized + '.html'),
    join(baseDir, normalized, 'index.html'),
  ]

  for (const path of possiblePaths) {
    if (htmlFiles.includes(path)) {
      return 'ok'
    }
  }

  return 'broken'
}

async function checkExternalLink(url: string): Promise<LinkResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkValidator/1.0)',
      },
    })

    clearTimeout(timeout)

    if (response.ok || response.status === 405) {
      // 405 = Method Not Allowed, but page exists
      return { url, source: '', status: 'ok', statusCode: response.status }
    }

    return { url, source: '', status: 'broken', statusCode: response.status }
  } catch (error) {
    return {
      url,
      source: '',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function validateLinks(dir: string, checkExternal: boolean): Promise<void> {
  console.log(`\n🔗 Link Validator\n`)
  console.log(`Directory: ${dir}`)
  console.log(`External:  ${checkExternal ? 'yes' : 'no'}\n`)

  const htmlFiles = await getHtmlFiles(dir)

  if (htmlFiles.length === 0) {
    console.log('No HTML files found.')
    return
  }

  console.log(`Found ${htmlFiles.length} HTML files\n`)

  const allInternalLinks = new Map<string, string[]>()
  const allExternalLinks = new Map<string, string[]>()

  // Extract links from all files
  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, 'utf-8')
    const { internal, external } = extractLinks(html, filePath)

    for (const link of internal) {
      const sources = allInternalLinks.get(link) || []
      sources.push(filePath)
      allInternalLinks.set(link, sources)
    }

    for (const link of external) {
      const sources = allExternalLinks.get(link) || []
      sources.push(filePath)
      allExternalLinks.set(link, sources)
    }
  }

  // Check internal links
  console.log(`Checking ${allInternalLinks.size} internal links...\n`)

  const brokenInternal: Array<{ link: string; sources: string[] }> = []

  for (const [link, sources] of allInternalLinks) {
    const status = await checkInternalLink(link, htmlFiles, dir)
    if (status === 'broken') {
      brokenInternal.push({ link, sources })
    }
  }

  if (brokenInternal.length > 0) {
    console.log(`❌ Broken internal links:\n`)
    for (const { link, sources } of brokenInternal) {
      console.log(`  ${link}`)
      for (const source of sources.slice(0, 3)) {
        console.log(`    ← ${source}`)
      }
      if (sources.length > 3) {
        console.log(`    ... and ${sources.length - 3} more`)
      }
    }
    console.log('')
  } else {
    console.log(`✅ All internal links OK\n`)
  }

  // Check external links
  if (checkExternal) {
    console.log(`Checking ${allExternalLinks.size} external links...\n`)

    const brokenExternal: LinkResult[] = []

    for (const [url] of allExternalLinks) {
      const result = await checkExternalLink(url)
      if (result.status !== 'ok') {
        brokenExternal.push(result)
      }
      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (brokenExternal.length > 0) {
      console.log(`⚠️  Potentially broken external links:\n`)
      for (const result of brokenExternal) {
        console.log(`  ${result.url}`)
        console.log(`    ${result.statusCode || result.error}`)
      }
      console.log('')
    } else {
      console.log(`✅ All external links OK\n`)
    }
  }

  // Summary
  console.log(`Summary:`)
  console.log(`  Internal: ${allInternalLinks.size} total, ${brokenInternal.length} broken`)
  if (checkExternal) {
    console.log(`  External: ${allExternalLinks.size} checked`)
  }
  console.log('')
}

// Parse CLI arguments
const args = process.argv.slice(2)
const dirIndex = args.indexOf('--dir')
const checkExternal = args.includes('--external')

const dir = dirIndex !== -1 ? args[dirIndex + 1] : DEFAULT_DIR

validateLinks(dir, checkExternal).catch(console.error)
