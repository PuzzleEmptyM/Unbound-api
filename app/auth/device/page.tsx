import { SignIn } from '@clerk/nextjs'
import { cookies } from 'next/headers'

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

  return (
    <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <SignIn />
    </main>
  )
}
