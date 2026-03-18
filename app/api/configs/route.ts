import { validateApiKey } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * GET /api/configs
 * Returns all saved interface configs for the authenticated user.
 * Response: { configs: [{ name, data, updated_at }] }
 */
export async function GET(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT name, data, updated_at
    FROM interface_configs
    WHERE user_id = ${user.userId}
    ORDER BY updated_at DESC
  `

  return NextResponse.json({ configs: rows })
}

/**
 * POST /api/configs
 * Upserts a full interface config (the entire config.json) for the authenticated user.
 * Body: { name: string, data: object }
 */
export async function POST(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { name?: string; data?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = body.name ?? 'Default'
  const { data } = body
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing data object' }, { status: 400 })
  }

  await sql`
    INSERT INTO interface_configs (user_id, name, data, updated_at)
    VALUES (${user.userId}, ${name}, ${JSON.stringify(data)}, NOW())
    ON CONFLICT (user_id, name)
    DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
  `

  return NextResponse.json({ ok: true })
}

/**
 * DELETE /api/configs?name=xxx
 * Removes a saved interface config by name.
 */
export async function DELETE(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  if (!name) return NextResponse.json({ error: 'Missing name' }, { status: 400 })

  await sql`
    DELETE FROM interface_configs WHERE user_id = ${user.userId} AND name = ${name}
  `

  return NextResponse.json({ ok: true })
}
