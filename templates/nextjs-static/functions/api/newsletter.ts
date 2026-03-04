/**
 * Newsletter subscription handler
 *
 * POST /api/newsletter
 *
 * Progressive enhancement:
 * - Without JS: 303 redirect to /thanks/newsletter
 * - With JS: JSON response for inline states
 */

interface Env {
  TURNSTILE_SECRET?: string
  BUTTONDOWN_API_KEY?: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const formData = await context.request.formData()

  // Check honeypot
  const honeypot = formData.get('website')
  if (honeypot) {
    return new Response('', { status: 200 })
  }

  // TODO: Verify Turnstile token
  // TODO: Rate limiting

  const email = formData.get('email')

  // TODO: Subscribe via Buttondown API
  console.log('Newsletter subscription:', { email })

  // Check if AJAX request
  const acceptHeader = context.request.headers.get('accept') || ''
  if (acceptHeader.includes('application/json')) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Progressive enhancement: redirect for non-JS
  return Response.redirect('/thanks/newsletter/', 303)
}
