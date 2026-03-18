import { createHash } from 'crypto'
import { sql } from './db'

export interface AuthUser {
  userId: string
  email: string | null
}

/**
 * Validates a Bearer API key from the Authorization header.
 * Returns the associated user or null if the key is invalid.
 */
export async function validateApiKey(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const rawKey = authHeader.slice(7).trim()
  if (!rawKey) return null

  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  const rows = await sql`
    UPDATE api_keys
    SET last_used_at = NOW()
    WHERE key_hash = ${keyHash}
    RETURNING user_id, user_email
  `

  if (rows.length === 0) return null

  return { userId: rows[0].user_id, email: rows[0].user_email }
}

/**
 * Generates a secure random API key and stores its hash.
 * Returns the raw key (only time it is available in plaintext).
 */
export async function createApiKey(userId: string, userEmail: string | null): Promise<string> {
  // Revoke any existing key for this user first (one key per user)
  await sql`DELETE FROM api_keys WHERE user_id = ${userId}`

  const rawKey = generateKey()
  const keyHash = createHash('sha256').update(rawKey).digest('hex')

  await sql`
    INSERT INTO api_keys (user_id, user_email, key_hash)
    VALUES (${userId}, ${userEmail}, ${keyHash})
  `

  return rawKey
}

/** Revokes all API keys for a user. */
export async function revokeApiKeys(userId: string): Promise<void> {
  await sql`DELETE FROM api_keys WHERE user_id = ${userId}`
}

function generateKey(): string {
  // 32 random bytes → hex string (64 chars)
  const { randomBytes } = require('crypto')
  return 'unbound_' + randomBytes(32).toString('hex')
}
