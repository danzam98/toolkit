import * as p from '@clack/prompts'

export interface ProjectOptions {
  projectName: string
  brandName: string
  domain: string
  description: string
  template: 'nextjs-static'
  includeFunctions: boolean
  includeShadcn: boolean
  includeMotion: boolean
  primaryColor: string
}

function toTitleCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function promptForOptions(
  projectName: string
): Promise<ProjectOptions | symbol> {
  const options = await p.group(
    {
      brandName: () =>
        p.text({
          message: 'Brand name',
          placeholder: toTitleCase(projectName),
          defaultValue: toTitleCase(projectName),
        }),

      domain: () =>
        p.text({
          message: 'Domain (leave blank for later)',
          placeholder: 'example.com',
          defaultValue: '',
        }),

      description: () =>
        p.text({
          message: 'Description',
          placeholder: 'A modern web application',
          defaultValue: 'A modern web application',
        }),

      template: () =>
        p.select({
          message: 'Template',
          options: [
            {
              value: 'nextjs-static',
              label: 'Next.js Static',
              hint: 'Next.js 16 + Tailwind v4 + Cloudflare Pages',
            },
          ],
          initialValue: 'nextjs-static' as const,
        }),

      includeFunctions: () =>
        p.confirm({
          message: 'Include Cloudflare Pages Functions?',
          initialValue: true,
        }),

      includeShadcn: () =>
        p.confirm({
          message: 'Include shadcn/ui components?',
          initialValue: true,
        }),

      includeMotion: () =>
        p.confirm({
          message: 'Include Motion animations?',
          initialValue: true,
        }),

      primaryColor: () =>
        p.text({
          message: 'Primary brand color (hex)',
          placeholder: '#4F46E5',
          defaultValue: '#4F46E5',
          validate: (value) => {
            if (value && !/^#[0-9A-Fa-f]{6}$/.test(value)) {
              return 'Must be a valid hex color (e.g., #4F46E5)'
            }
            return undefined
          },
        }),
    },
    {
      onCancel: () => {
        p.cancel('Operation cancelled.')
        process.exit(0)
      },
    }
  )

  return {
    projectName,
    brandName: options.brandName || toTitleCase(projectName),
    domain: options.domain || 'example.com',
    description: options.description || 'A modern web application',
    template: options.template || 'nextjs-static',
    includeFunctions: options.includeFunctions ?? true,
    includeShadcn: options.includeShadcn ?? true,
    includeMotion: options.includeMotion ?? true,
    primaryColor: options.primaryColor || '#4F46E5',
  }
}
