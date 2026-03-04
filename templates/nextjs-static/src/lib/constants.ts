/**
 * Site configuration
 */
export const siteConfig = {
  name: '{{BRAND_NAME}}',
  description: '{{DESCRIPTION}}',
  url: 'https://{{DOMAIN}}',
  author: '{{AUTHOR}}',
} as const

/**
 * Navigation items
 */
export const navigation = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
] as const

/**
 * Footer navigation
 */
export const footerLinks = {
  main: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ],
  legal: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
  ],
} as const

/**
 * Social links
 */
export const socialLinks = {
  github: 'https://github.com/{{GITHUB_USERNAME}}',
  twitter: 'https://twitter.com/{{TWITTER_USERNAME}}',
} as const
