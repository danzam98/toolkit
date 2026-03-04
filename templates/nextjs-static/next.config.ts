import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Required for static export
  images: {
    unoptimized: true,
  },

  // Better Cloudflare Pages compatibility
  trailingSlash: true,

  // React Compiler (stable in Next.js 16)
  reactCompiler: true,

  // Type-safe <Link> components
  typedRoutes: true,
}

export default nextConfig
