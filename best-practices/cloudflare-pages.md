# Cloudflare Pages Deployment

> **Last Updated**: March 2026

## Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}
```

## Build

```bash
bun run build
# Outputs to `out/` directory
```

## Deployment Options

### Option 1: Static Export (Simple)

```yaml
# wrangler.toml
name = "my-project"
compatibility_date = "2026-03-01"

[site]
bucket = "./out"
```

Deploy via Cloudflare dashboard or CLI:

```bash
bunx wrangler pages deploy out
```

### Option 2: OpenNext + Workers (Full Features)

As of December 2025, Cloudflare recommends [OpenNext](https://opennext.js.org/cloudflare) for full Next.js feature support:

```bash
bunx @opennextjs/cloudflare
```

## Security Headers

```
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/images/*
  Cache-Control: public, max-age=31536000, immutable

/og/*
  Cache-Control: public, max-age=31536000, immutable
```

## Pages Functions

Create serverless functions in `functions/api/`:

```typescript
// functions/api/contact.ts
export async function onRequestPost(context) {
  const formData = await context.request.formData()

  // Verify Turnstile
  const token = formData.get('cf-turnstile-response')
  // ... verification logic

  // Process form
  const name = formData.get('name')
  // ... send email

  // Progressive enhancement: redirect for non-JS
  return Response.redirect('/thanks/contact', 303)
}
```

## Environment Variables

Set in Cloudflare dashboard or `wrangler.toml`:

```toml
[vars]
NEXT_PUBLIC_SITE_URL = "https://example.com"

# For secrets, use wrangler CLI:
# wrangler secret put TURNSTILE_SECRET
```

## References

- [Cloudflare Pages Static Guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
