import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { Auth } from 'better-auth'
import { db, schema } from '@foundation-trpc/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    cookiePrefix: 'better-auth',
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  trustedOrigins: [
    'https://expresss-nextjs-trpc-monorepo.vercel.app',
    'https://express-nextjs-trpc-monorepo-api.up.railway.app',
  ],
}) as Auth

export type AUTH = typeof auth
