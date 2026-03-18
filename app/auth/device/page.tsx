import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DevicePage() {
  const jar = await cookies()
  const port = jar.get('unbound_port')?.value
  const state = jar.get('unbound_state')?.value

  if (!port || !state) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#888', fontFamily: 'monospace' }}>
          Invalid request — please use the Sign In button inside the Unbound app.
        </p>
      </main>
    )
  }

  // Already signed in — skip the sign-in UI and go straight to callback
  const { userId } = await auth()
  if (userId) redirect('/auth/device/callback')

  return (
    <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <SignIn />
    </main>
  )
}
