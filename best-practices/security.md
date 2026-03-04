# Security

> **Last Updated**: March 2026

## Security Headers

```
# public/_headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com

/images/*
  Cache-Control: public, max-age=31536000, immutable
```

## Cloudflare Turnstile

### Client-Side Widget

```typescript
'use client'

import { useEffect, useRef } from 'react'

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
}

export function Turnstile({ siteKey, onVerify }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !window.turnstile) return

    window.turnstile.render(ref.current, {
      sitekey: siteKey,
      callback: onVerify,
    })
  }, [siteKey, onVerify])

  return <div ref={ref} />
}
```

### Server-Side Verification

```typescript
// functions/api/contact.ts
export async function onRequestPost(context) {
  const formData = await context.request.formData()

  // Verify Turnstile
  const token = formData.get('cf-turnstile-response')
  const verification = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: context.env.TURNSTILE_SECRET,
        response: token,
      }),
    }
  )

  const result = await verification.json()
  if (!result.success) {
    return new Response('Verification failed', { status: 403 })
  }

  // Continue processing...
}
```

## Honeypot Fields

```typescript
// Hidden field to catch bots
<input
  type="text"
  name="website"
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
/>

// Server-side check
if (formData.get('website')) {
  return new Response('', { status: 200 })  // Silent fail for bots
}
```

## Rate Limiting

Use Cloudflare's built-in rate limiting or Durable Objects:

```typescript
// functions/api/contact.ts
const IP = context.request.headers.get('CF-Connecting-IP')
const rateLimitKey = `rate-limit:${IP}`

// Check rate limit (example with KV)
const count = await context.env.RATE_LIMITS.get(rateLimitKey)
if (count && parseInt(count) > 10) {
  return new Response('Too many requests', { status: 429 })
}

// Increment counter
await context.env.RATE_LIMITS.put(rateLimitKey, String((parseInt(count) || 0) + 1), {
  expirationTtl: 3600,
})
```

## security.txt

```
# public/.well-known/security.txt
Contact: mailto:security@example.com
Preferred-Languages: en
Canonical: https://example.com/.well-known/security.txt
```

## OWASP Top 10 Prevention

| Vulnerability | Prevention |
|--------------|------------|
| Injection | Parameterized queries, input validation |
| XSS | Content-Security-Policy, output encoding |
| CSRF | SameSite cookies, CSRF tokens |
| Broken Auth | Rate limiting, secure session management |
| Security Misconfig | Security headers, minimal permissions |

## References

- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
