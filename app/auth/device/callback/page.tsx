'use client'

import { Suspense, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

function DeviceCallback() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    async function finish() {
      try {
        const clerkToken = await getToken()

        // Exchange Clerk JWT for a long-lived API key
        const res = await fetch('/api/auth/device-key', {
          method: 'POST',
          headers: { Authorization: `Bearer ${clerkToken}` },
        })
        if (!res.ok) throw new Error(`API error ${res.status}`)
        const { key } = await res.json()

        // Read port + state from cookie via the server endpoint
        const paramRes = await fetch('/api/auth/device-params')
        if (!paramRes.ok) throw new Error('Could not read device session params')
        const { port, state } = await paramRes.json()

        if (!port || !state) throw new Error('Missing port or state — please try again from the app.')

        window.location.href = `http://localhost:${port}/callback?key=${encodeURIComponent(key)}&state=${encodeURIComponent(state)}`
        setStatus('done')
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
    }

    finish()
  }, [isLoaded, isSignedIn, getToken])

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    fontFamily: 'monospace',
    color: '#ccc',
    gap: '1rem',
  }

  if (!isLoaded) return <div style={style}>Loading…</div>
  if (!isSignedIn) return <div style={style}>Not signed in — please try again from the app.</div>
  if (status === 'error') return <div style={style}><p>Error: {errorMsg}</p><p>You can close this tab and try again.</p></div>
  if (status === 'done') return <div style={style}>✓ Signed in. You can close this tab.</div>

  return <div style={style}>Signing you in to Unbound…</div>
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div style={{ fontFamily: 'monospace', color: '#ccc', padding: '2rem' }}>Loading…</div>}>
      <DeviceCallback />
    </Suspense>
  )
}
