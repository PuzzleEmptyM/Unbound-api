import { validateApiKey } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * GET /api/layers
 * Returns all layers for the authenticated user.
 * Response: { layers: { [layer_id]: layerData } }
 */
export async function GET(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await sql`
    SELECT layer_id, data, updated_at
    FROM layers
    WHERE user_id = ${user.userId}
    ORDER BY updated_at DESC
  `

  const layers: Record<string, unknown> = {}
  for (const row of rows) {
    layers[row.layer_id] = row.data
  }

  return NextResponse.json({ layers })
}

/**
 * POST /api/layers
 * Upserts one or more layers for the authenticated user.
 * Body: { layers: { [layer_id]: layerData } }
 * Cloud always wins — this replaces whatever is stored.
 */
export async function POST(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { layers?: Record<string, unknown> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { layers } = body
  if (!layers || typeof layers !== 'object') {
    return NextResponse.json({ error: 'Missing layers object' }, { status: 400 })
  }

  for (const [layerId, data] of Object.entries(layers)) {
    await sql`
      INSERT INTO layers (user_id, layer_id, data, updated_at)
      VALUES (${user.userId}, ${layerId}, ${JSON.stringify(data)}, NOW())
      ON CONFLICT (user_id, layer_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `
  }

  return NextResponse.json({ ok: true, saved: Object.keys(layers).length })
}

/**
 * DELETE /api/layers?layer_id=xxx
 * Removes a single layer for the authenticated user.
 */
export async function DELETE(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const layerId = searchParams.get('layer_id')
  if (!layerId) return NextResponse.json({ error: 'Missing layer_id' }, { status: 400 })

  await sql`
    DELETE FROM layers WHERE user_id = ${user.userId} AND layer_id = ${layerId}
  `

  return NextResponse.json({ ok: true })
}
