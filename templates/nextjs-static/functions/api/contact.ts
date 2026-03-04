/**
 * Contact form handler
 *
 * POST /api/contact
 *
 * Progressive enhancement:
 * - Without JS: 303 redirect to /thanks/contact
 * - With JS: JSON response for inline states
 */

interface Env {
  TURNSTILE_SECRET?: string
  RESEND_API_KEY?: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const formData = await context.request.formData()

  // Check honeypot
  const honeypot = formData.get('website')
  if (honeypot) {
    // Silent success for bots
    return new Response('', { status: 200 })
  }

  // TODO: Verify Turnstile token
  // const token = formData.get('cf-turnstile-response')
  // const verification = await verifyTurnstile(token, context.env.TURNSTILE_SECRET)

  // TODO: Rate limiting

  // TODO: Send email via Resend API
  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  console.log('Contact form submission:', { name, email, message })

  // Check if AJAX request
  const acceptHeader = context.request.headers.get('accept') || ''
  if (acceptHeader.includes('application/json')) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Progressive enhancement: redirect for non-JS
  return Response.redirect('/thanks/contact/', 303)
}
