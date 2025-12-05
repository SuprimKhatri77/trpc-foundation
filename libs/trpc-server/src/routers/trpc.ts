import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from '../context'
import { ProtectedContext } from '@foundation-trpc/types'
import { fromNodeHeaders } from '@foundation-trpc/auth'

export const t = initTRPC.context<Context>().create()

export const router = t.router as typeof t.router
export const publicProcedure = t.procedure as typeof t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const headers = fromNodeHeaders(ctx.req.headers)
  const session = await ctx.auth.api.getSession({
    headers,
  })

  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      userId: session.user.id,
    } as ProtectedContext,
  })
}) as typeof t.procedure
