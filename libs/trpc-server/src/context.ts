import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

import type { DATABASE } from '@foundation-trpc/db'

import type { AUTH } from '@foundation-trpc/auth'
import { AppContext } from '@foundation-trpc/types'

export const createContextFactory = (deps: { db: DATABASE; auth: AUTH }) => {
  return async ({
    req,
    res,
  }: CreateExpressContextOptions): Promise<AppContext> => {
    console.log('contetx is getting triggered')

    return {
      req,
      res,
      db: deps.db,
      auth: deps.auth,
    }
  }
}

export type Context = AppContext
