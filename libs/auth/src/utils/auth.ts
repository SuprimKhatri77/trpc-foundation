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
        'https://api.calculators247.com' ||
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
    },
    crossSubDomainCookies: {
      enabled: true,
      domain: 'calculators247.com',
    },
  },
  trustedOrigins: [
    'https://calculators247.com',
    'https://api.calculators247.com',
    'https://trpc-foundation-monorepo.onrender.com',
    'https://express-nextjs-trpc-api.onrender.com',
    'http://localhost:5000',
    'http://localhost:3000',
  ],
}) as Auth

export type AUTH = typeof auth
