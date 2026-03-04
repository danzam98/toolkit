import { mkdir, readdir, readFile, writeFile, cp, rm } from 'fs/promises'
import { join, relative } from 'path'
import type { ProjectOptions } from './prompts'

const TEMPLATE_REPO = 'danzam98/toolkit/templates'

interface Placeholders {
  '{{PROJECT_NAME}}': string
  '{{BRAND_NAME}}': string
  '{{DOMAIN}}': string
  '{{DESCRIPTION}}': string
  '{{AUTHOR}}': string
  '{{GITHUB_USERNAME}}': string
  '{{TWITTER_USERNAME}}': string
  '{{PRIMARY_COLOR}}': string
  '{{YEAR}}': string
}

function getPlaceholders(options: ProjectOptions): Placeholders {
  return {
    '{{PROJECT_NAME}}': options.projectName,
    '{{BRAND_NAME}}': options.brandName,
    '{{DOMAIN}}': options.domain || 'example.com',
    '{{DESCRIPTION}}': options.description,
    '{{AUTHOR}}': '',
    '{{GITHUB_USERNAME}}': '',
    '{{TWITTER_USERNAME}}': '',
    '{{PRIMARY_COLOR}}': options.primaryColor,
    '{{YEAR}}': new Date().getFullYear().toString(),
  }
}

async function replaceInFile(
  filePath: string,
  placeholders: Placeholders
): Promise<void> {
  try {
    let content = await readFile(filePath, 'utf-8')
    let modified = false

    for (const [placeholder, value] of Object.entries(placeholders)) {
      if (content.includes(placeholder)) {
        content = content.replaceAll(placeholder, value)
        modified = true
      }
    }

    if (modified) {
      await writeFile(filePath, content)
    }
  } catch {
    // Skip binary files
  }
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

async function cloneTemplate(
  template: string,
  destination: string
): Promise<void> {
  // Try to use degit
  const degit = await import('degit')
  const emitter = degit.default(`${TEMPLATE_REPO}/${template}`, {
    cache: false,
    force: true,
    verbose: false,
  })

  await emitter.clone(destination)
}

async function cloneLocal(
  templateDir: string,
  destination: string
): Promise<void> {
  await cp(templateDir, destination, { recursive: true })
}

export async function scaffoldProject(
  projectName: string,
  options: ProjectOptions
): Promise<void> {
  const projectDir = join(process.cwd(), projectName)

  // Create project directory
  await mkdir(projectDir, { recursive: true })

  // Try to clone from GitHub, fall back to local template
  try {
    await cloneTemplate(options.template, projectDir)
  } catch {
    // Fall back to local template if available
    const localTemplate = join(
      import.meta.dir,
      '..',
      'templates',
      options.template
    )
    await cloneLocal(localTemplate, projectDir)
  }

  // Remove functions if not needed
  if (!options.includeFunctions) {
    const functionsDir = join(projectDir, 'functions')
    await rm(functionsDir, { recursive: true, force: true })
  }

  // Get all files for placeholder replacement
  const files = await getFilesRecursively(projectDir)
  const placeholders = getPlaceholders(options)

  // Replace placeholders in all files
  for (const file of files) {
    await replaceInFile(file, placeholders)
  }
}
