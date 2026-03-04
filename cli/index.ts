#!/usr/bin/env bun

/**
 * Create Toolkit App CLI
 *
 * Interactive CLI for scaffolding Next.js projects with best practices.
 *
 * Usage:
 *   bun create danzam98/toolkit my-project
 *   bunx create-toolkit-app my-project
 */

import * as p from '@clack/prompts'
import pc from 'picocolors'
import { promptForOptions, type ProjectOptions } from './prompts'
import { scaffoldProject } from './scaffold'
import { runPostSetup } from './post-setup'

async function main() {
  console.clear()

  p.intro(pc.bgCyan(pc.black(' Create Toolkit App ')))

  // Get project name from CLI args or prompt
  const args = process.argv.slice(2)
  const projectNameArg = args.find((arg) => !arg.startsWith('-'))

  let projectName: string

  if (projectNameArg) {
    projectName = projectNameArg
    p.log.info(`Creating project: ${pc.cyan(projectName)}`)
  } else {
    const nameResult = await p.text({
      message: 'What is your project name?',
      placeholder: 'my-project',
      validate: (value) => {
        if (!value) return 'Project name is required'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Project name must be lowercase with hyphens only'
        }
        return undefined
      },
    })

    if (p.isCancel(nameResult)) {
      p.cancel('Operation cancelled.')
      process.exit(0)
    }

    projectName = nameResult
  }

  // Prompt for options
  const options = await promptForOptions(projectName)

  if (p.isCancel(options)) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }

  // Confirm
  const confirmed = await p.confirm({
    message: `Create ${pc.cyan(projectName)} with these options?`,
  })

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel('Operation cancelled.')
    process.exit(0)
  }

  // Scaffold the project
  const s = p.spinner()
  s.start('Creating project...')

  try {
    await scaffoldProject(projectName, options)
    s.stop('Project created!')
  } catch (error) {
    s.stop('Failed to create project')
    p.log.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }

  // Run post-setup
  const runSetup = await p.confirm({
    message: 'Run post-setup? (install dependencies, git init)',
    initialValue: true,
  })

  if (!p.isCancel(runSetup) && runSetup) {
    await runPostSetup(projectName, options)
  }

  // Done
  p.note(
    `${pc.cyan('cd')} ${projectName}\n${pc.cyan('bun dev')}`,
    'Next steps'
  )

  p.outro(pc.green('Happy coding!'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
