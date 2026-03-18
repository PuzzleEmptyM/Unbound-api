import { neon } from '@neondatabase/serverless'

if (!process.env.STORAGE_DATABASE_URL) {
  throw new Error('STORAGE_DATABASE_URL environment variable is not set')
}

export const sql = neon(process.env.STORAGE_DATABASE_URL)
