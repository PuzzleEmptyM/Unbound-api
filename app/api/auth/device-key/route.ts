import { auth, currentUser } from '@clerk/nextjs/server'
import { createApiKey } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/device-key
 * Called by the browser callback page after Clerk sign-in.
 * Requires a Clerk session JWT in the Authorization header (injected by useAuth().getToken()).
 * Returns a long-lived API key for the desktop app.
 */
export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null

  const key = await createApiKey(userId, email)

  return NextResponse.json({ key })
}
