'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback
      afterSignInUrl="/auth/device/callback"
      afterSignUpUrl="/auth/device/callback"
    />
  )
}
