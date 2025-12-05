import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

import type { DATABASE } from '@foundation-trpc/db'

import { fromNodeHeaders } from '@foundation-trpc/auth'
import type { AUTH } from '@foundation-trpc/auth'
import { AppContext } from '@foundation-trpc/types'

export const createContextFactory = (deps: { db: DATABASE; auth: AUTH }) => {
  return async ({
    req,
    res,
  }: CreateExpressContextOptions): Promise<AppContext> => {
    console.log('contetx is getting triggered')
    const headers = fromNodeHeaders(req.headers)
    console.log('headers from  request in context: ', headers)
    let userId: string | undefined

    try {
      const session = await deps.auth.api.getSession({
        headers,
      })

      console.log('session result: ', session)

      if (session) {
        console.log('session found now setting the userid.')
        userId = session.user.id
        console.log('user id set.')
      }
    } catch (error) {
      console.log('error: ', error)
    }

    return {
      req,
      res,
      db: deps.db,
      auth: deps.auth,
      userId,
    }
  }
}

export type Context = AppContext
