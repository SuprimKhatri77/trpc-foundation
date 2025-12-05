import { router } from './trpc'
import { authRoutes } from './auth.router'
import { inferRouterOutputs } from '@trpc/server'

export const appRouter = router({
  auth: authRoutes,
})

export type AppRouter = typeof appRouter
export type AppRouterType = inferRouterOutputs<AppRouter>
