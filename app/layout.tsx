import type { Metadata } from 'next'
import { ClerkProvider, Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Unbound API',
  description: 'Unbound cloud sync backend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
