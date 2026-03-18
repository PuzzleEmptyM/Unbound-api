import { SignIn } from '@clerk/nextjs'

interface Props {
  searchParams: Promise<{ port?: string; state?: string }>
}

export default async function DevicePage({ searchParams }: Props) {
  const { port, state } = await searchParams

  if (!port || !state) {
    return (
      <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#888', fontFamily: 'monospace' }}>
          Invalid request — please use the Sign In button inside the Unbound app.
        </p>
      </main>
    )
  }

  const callbackUrl = `/auth/device/callback?port=${port}&state=${state}`

  return (
    <main style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
      <SignIn
        forceRedirectUrl={callbackUrl}
        signUpForceRedirectUrl={callbackUrl}
      />
    </main>
  )
}
