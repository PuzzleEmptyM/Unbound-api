import { neon } from '@neondatabase/serverless'

function getDb() {
  const url = process.env.STORAGE_DATABASE_URL
  if (!url) throw new Error('STORAGE_DATABASE_URL environment variable is not set')
  return neon(url)
}

export const sql = getDb()
