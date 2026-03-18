import { validateApiKey } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * GET /api/sync
 * Returns everything for the authenticated user in a single request.
 * The desktop app uses this on startup to apply cloud state locally.
 * Cloud always wins — the client should overwrite its local config with this data.
 *
 * Response:
 * {
 *   layers: { [layer_id]: layerData },
 *   configs: [{ name, data, updated_at }],
 *   synced_at: ISO string
 * }
 */
export async function GET(request: Request) {
  const user = await validateApiKey(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [layerRows, configRows] = await Promise.all([
    sql`SELECT layer_id, data FROM layers WHERE user_id = ${user.userId} ORDER BY updated_at DESC`,
    sql`SELECT name, data, updated_at FROM interface_configs WHERE user_id = ${user.userId} ORDER BY updated_at DESC`,
  ])

  const layers: Record<string, unknown> = {}
  for (const row of layerRows) {
    layers[row.layer_id] = row.data
  }

  return NextResponse.json({
    layers,
    configs: configRows,
    synced_at: new Date().toISOString(),
  })
}
