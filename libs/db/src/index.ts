import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'
import { configDotenv } from 'dotenv'

configDotenv()
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })
export type DATABASE = typeof db

export { sql }

export * as schema from './schema'
