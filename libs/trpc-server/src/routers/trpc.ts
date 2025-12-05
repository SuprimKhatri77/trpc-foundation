import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from '../context'
import { ProtectedContext } from '@foundation-trpc/types'

export const t = initTRPC.context<Context>().create()

export const router = t.router as typeof t.router
export const publicProcedure = t.procedure as typeof t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    } as ProtectedContext,
  })
}) as typeof t.procedure
