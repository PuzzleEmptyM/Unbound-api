import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const jar = await cookies()
  const port = jar.get('unbound_port')?.value ?? null
  const state = jar.get('unbound_state')?.value ?? null
  return NextResponse.json({ port, state })
}
