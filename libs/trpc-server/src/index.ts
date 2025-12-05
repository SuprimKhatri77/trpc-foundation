import { appRouter } from './routers/index'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { createContextFactory } from './context'
import { auth } from '@foundation-trpc/auth'
import { db } from '@foundation-trpc/db'

const createContext = createContextFactory({
  auth,
  db,
})
export const trpcExpress = createExpressMiddleware({
  router: appRouter,
  createContext,
})

export { appRouter } from './routers/index'
export type { AppRouter } from './routers/index'
