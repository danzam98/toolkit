#!/usr/bin/env bun

/**
 * Post-clone setup script
 *
 * Usage: bun run scripts/setup.ts
 *
 * This script replaces placeholders in the template with actual values.
 * It's useful for non-CLI users who cloned the template directly.
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import * as readline from 'readline'

const PLACEHOLDERS = [
  { key: '{{PROJECT_NAME}}', prompt: 'Project name (kebab-case):', default: 'my-project' },
  { key: '{{BRAND_NAME}}', prompt: 'Brand name:', default: 'My Project' },
  { key: '{{DOMAIN}}', prompt: 'Domain (e.g., example.com):', default: 'example.com' },
  { key: '{{DESCRIPTION}}', prompt: 'Description:', default: 'A modern web application' },
  { key: '{{AUTHOR}}', prompt: 'Author name:', default: '' },
  { key: '{{GITHUB_USERNAME}}', prompt: 'GitHub username:', default: '' },
  { key: '{{TWITTER_USERNAME}}', prompt: 'Twitter username:', default: '' },
]

async function prompt(question: string, defaultValue: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    const displayQuestion = defaultValue
      ? `${question} (${defaultValue}) `
      : `${question} `

    rl.question(displayQuestion, (answer) => {
      rl.close()
      resolve(answer || defaultValue)
    })
  })
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...(await getFilesRecursively(path)))
      }
    } else {
      files.push(path)
    }
  }

  return files
}

async function replaceInFile(
  filePath: string,
  replacements: Map<string, string>
): Promise<boolean> {
  try {
    let content = await readFile(filePath, 'utf-8')
    let modified = false

    for (const [placeholder, value] of replacements) {
      if (content.includes(placeholder)) {
        content = content.replaceAll(placeholder, value)
        modified = true
      }
    }

    if (modified) {
      await writeFile(filePath, content)
      console.log(`  Updated: ${filePath}`)
    }

    return modified
  } catch {
    return false
  }
}

async function main() {
  console.log('\n🚀 Project Setup\n')
  console.log('This script will customize the template for your project.\n')

  // Collect values
  const replacements = new Map<string, string>()

  for (const { key, prompt: question, default: defaultValue } of PLACEHOLDERS) {
    const value = await prompt(question, defaultValue)
    replacements.set(key, value)
  }

  // Add derived values
  replacements.set('{{YEAR}}', new Date().getFullYear().toString())

  console.log('\n📝 Applying replacements...\n')

  // Find and update files
  const projectRoot = process.cwd()
  const files = await getFilesRecursively(projectRoot)

  let updatedCount = 0
  for (const file of files) {
    const updated = await replaceInFile(file, replacements)
    if (updated) updatedCount++
  }

  console.log(`\n✅ Updated ${updatedCount} files\n`)
  console.log('Next steps:')
  console.log('  1. bun install')
  console.log('  2. git init && git add -A && git commit -m "Initial commit"')
  console.log('  3. bun dev')
  console.log('')
}

main().catch(console.error)
