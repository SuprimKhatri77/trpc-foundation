import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Auth } from 'better-auth'
import { db, schema } from '@foundation-trpc/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_API_URL ||
        'https://express-nextjs-trpc-api.onrender.com'
      : 'http://localhost:5000',
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    cookiePrefix: 'better-auth',
    useSecureCookies: process.env.NODE_ENV === 'production',
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      path: '/',
      partitioned: process.env.NODE_ENV === 'production',
    },
    crossSubDomainCookies: {
      enabled: false,
      domain:
        process.env.NODE_ENV === 'production' ? '.onrender.com' : 'localhost',
    },
  },
  trustedOrigins: [
    'https://trpc-foundation-monorepo.onrender.com',
    'https://express-nextjs-trpc-api.onrender.com',
    'http://localhost:5000',
    'http://localhost:3000',
  ],
}) as Auth

export type AUTH = typeof auth
