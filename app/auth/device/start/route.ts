import { NextRequest, NextResponse } from 'next/server'

/**
 * Sets port + state in cookies, then redirects to the sign-in page.
 * This ensures port/state survive the OAuth round-trip (Google, etc.)
 * since cookies persist across redirects while query params do not.
 */
export async function GET(req: NextRequest) {
  const port = req.nextUrl.searchParams.get('port')
  const state = req.nextUrl.searchParams.get('state')

  if (!port || !state) {
    return NextResponse.redirect(new URL('/auth/device', req.url))
  }

  const res = NextResponse.redirect(new URL('/auth/device', req.url))
  const cookieOpts = { httpOnly: true, sameSite: 'lax' as const, maxAge: 600, path: '/' }
  res.cookies.set('unbound_port', port, cookieOpts)
  res.cookies.set('unbound_state', state, cookieOpts)
  return res
}
