import { validateApiKey, revokeApiKeys } from '@/lib/auth'
import { NextResponse } from 'next/server'

/** POST /api/auth/logout — revokes the caller's API key. */
export async function POST(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await revokeApiKeys(user.userId)
  return NextResponse.json({ ok: true })
}
