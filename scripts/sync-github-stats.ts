#!/usr/bin/env bun

/**
 * GitHub Stats Sync
 *
 * Fetches repository statistics from GitHub API and caches them locally.
 *
 * Usage:
 *   GITHUB_TOKEN=xxx bun run scripts/sync-github-stats.ts
 *   bun run scripts/sync-github-stats.ts --repos owner/repo1,owner/repo2 --output ./public/github-cache.json
 */

import { writeFile, readFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

const DEFAULT_OUTPUT = './public/github-cache.json'

interface RepoStats {
  owner: string
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  watchers: number
  language: string | null
  topics: string[]
  updatedAt: string
  url: string
}

interface GitHubCache {
  repos: Record<string, RepoStats>
  asOf: string
  partial: boolean
}

async function fetchRepoStats(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoStats | null> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'toolkit-github-sync',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    })

    if (!response.ok) {
      console.error(`  ✗ ${owner}/${repo}: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    return {
      owner: data.owner.login,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      language: data.language,
      topics: data.topics || [],
      updatedAt: data.updated_at,
      url: data.html_url,
    }
  } catch (error) {
    console.error(`  ✗ ${owner}/${repo}: ${error}`)
    return null
  }
}

async function loadExistingCache(outputPath: string): Promise<GitHubCache | null> {
  try {
    const content = await readFile(outputPath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

async function syncStats(repos: string[], outputPath: string): Promise<void> {
  console.log(`\n🐙 GitHub Stats Sync\n`)
  console.log(`Repos:  ${repos.length}`)
  console.log(`Output: ${outputPath}\n`)

  const token = process.env.GITHUB_TOKEN

  if (!token) {
    console.warn('⚠️  No GITHUB_TOKEN set. Rate limits will be strict.\n')
  }

  // Load existing cache for fallback
  const existingCache = await loadExistingCache(outputPath)
  const repoStats: Record<string, RepoStats> = {}
  let partial = false

  for (const repo of repos) {
    const [owner, name] = repo.split('/')
    if (!owner || !name) {
      console.warn(`  ⚠ Invalid repo format: ${repo}`)
      continue
    }

    const stats = await fetchRepoStats(owner, name, token)

    if (stats) {
      repoStats[repo] = stats
      console.log(`  ✓ ${repo}: ${stats.stars.toLocaleString()} stars`)
    } else {
      // Use cached data as fallback
      if (existingCache?.repos[repo]) {
        repoStats[repo] = existingCache.repos[repo]
        console.log(`  ↩ ${repo}: using cached data`)
        partial = true
      }
    }

    // Rate limit: 10 requests per second for authenticated, 60/hour for unauthenticated
    if (!token) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const cache: GitHubCache = {
    repos: repoStats,
    asOf: new Date().toISOString(),
    partial,
  }

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true })

  await writeFile(outputPath, JSON.stringify(cache, null, 2))

  console.log(`\n✅ Synced ${Object.keys(repoStats).length} repos`)
  if (partial) {
    console.log('   ⚠ Some repos used cached data (partial sync)')
  }
  console.log(`   Output: ${outputPath}\n`)
}

// Parse CLI arguments
const args = process.argv.slice(2)
const reposIndex = args.indexOf('--repos')
const outputIndex = args.indexOf('--output')

const reposArg = reposIndex !== -1 ? args[reposIndex + 1] : ''
const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : DEFAULT_OUTPUT

// Default repos (example)
const defaultRepos = [
  'Dicklesworthstone/llm_aided_ocr',
  'Dicklesworthstone/swiss_army_llama',
]

const repos = reposArg ? reposArg.split(',') : defaultRepos

syncStats(repos, outputPath).catch(console.error)
