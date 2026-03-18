import { validateApiKey } from '@/lib/auth'
import { NextResponse } from 'next/server'

/** GET /api/auth/me — returns the authenticated user's basic info. */
export async function GET(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  return NextResponse.json({ userId: user.userId, email: user.email })
}
