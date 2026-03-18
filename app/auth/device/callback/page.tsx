'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'

export default function DeviceCallback() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const searchParams = useSearchParams()
  const port = searchParams.get('port')
  const state = searchParams.get('state')
  const [status, setStatus] = useState<'pending' | 'done' | 'error'>('pending')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return

    async function finish() {
      try {
        const clerkToken = await getToken()
        const res = await fetch('/api/auth/device-key', {
          method: 'POST',
          headers: { Authorization: `Bearer ${clerkToken}` },
        })
        if (!res.ok) throw new Error(`API error ${res.status}`)

        const { key } = await res.json()
        // Redirect to the desktop app's local callback server
        window.location.href = `http://localhost:${port}/callback?key=${encodeURIComponent(key)}&state=${encodeURIComponent(state ?? '')}`
        setStatus('done')
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
    }

    finish()
  }, [isLoaded, isSignedIn, getToken, port, state])

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
