import { spawn } from 'child_process'
import { join } from 'path'
import * as p from '@clack/prompts'
import pc from 'picocolors'
import type { ProjectOptions } from './prompts'

function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: 'pipe',
      shell: true,
    })

    let stderr = ''
    proc.stderr?.on('data', (data) => {
      stderr += data.toString()
    })

    proc.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed: ${command} ${args.join(' ')}\n${stderr}`))
      }
    })

    proc.on('error', reject)
  })
}

export async function runPostSetup(
  projectName: string,
  options: ProjectOptions
): Promise<void> {
  const projectDir = join(process.cwd(), projectName)
  const s = p.spinner()

  // Install dependencies
  s.start('Installing dependencies...')
  try {
    await runCommand('bun', ['install'], projectDir)
    s.stop('Dependencies installed')
  } catch (error) {
    s.stop('Failed to install dependencies')
    p.log.warn('Run `bun install` manually')
  }

  // Initialize git
  s.start('Initializing git...')
  try {
    await runCommand('git', ['init'], projectDir)
    await runCommand('git', ['add', '-A'], projectDir)
    await runCommand(
      'git',
      ['commit', '-m', 'Initial commit from create-toolkit-app'],
      projectDir
    )
    s.stop('Git initialized')
  } catch (error) {
    s.stop('Failed to initialize git')
    p.log.warn('Run `git init` manually')
  }

  // Initialize shadcn if selected
  if (options.includeShadcn) {
    s.start('Initializing shadcn/ui...')
    try {
      await runCommand(
        'bunx',
        ['shadcn@latest', 'init', '--yes', '--defaults'],
        projectDir
      )
      s.stop('shadcn/ui initialized')
    } catch (error) {
      s.stop('Failed to initialize shadcn/ui')
      p.log.warn('Run `bunx shadcn@latest init` manually')
    }
  }

  // Initialize husky
  s.start('Setting up pre-commit hooks...')
  try {
    await runCommand('bunx', ['husky', 'init'], projectDir)
    s.stop('Husky initialized')
  } catch (error) {
    s.stop('Failed to initialize husky')
    p.log.warn('Run `bunx husky init` manually')
  }

  // Initialize beads (optional)
  const initBeads = await p.confirm({
    message: 'Initialize beads issue tracking (br)?',
    initialValue: true,
  })

  if (initBeads) {
    s.start('Initializing beads...')
    try {
      // Check if br is available
      await runCommand('which', ['br'], projectDir)
      await runCommand('br', ['init'], projectDir)
      s.stop('Beads initialized')
    } catch (error) {
      s.stop('Beads not initialized')
      p.log.warn(pc.yellow('br not found. Install with: cargo install beads_rust'))
      p.log.warn('Then run `br init` manually')
    }
  }

  // Verify build
  s.start('Verifying build...')
  try {
    await runCommand('bun', ['run', 'build'], projectDir)
    s.stop('Build verified')
  } catch (error) {
    s.stop('Build verification failed')
    p.log.warn('Check for build errors with `bun run build`')
  }
}
