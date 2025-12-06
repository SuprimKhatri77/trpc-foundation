import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from '../context'
import { ProtectedContext } from '@foundation-trpc/types'
import { fromNodeHeaders } from '@foundation-trpc/auth'

export const t = initTRPC.context<Context>().create()

export const router = t.router as typeof t.router
export const publicProcedure = t.procedure as typeof t.procedure
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  console.log('headers in protected procedure: ', ctx.req.headers)
  const headers = fromNodeHeaders(ctx.req.headers)
  const result = await ctx.auth.api.getSession({
    headers,
  })
  console.log('session query result: ', result)

  if (!result || !result.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User not logged in.',
    })
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...result.session,
        user: result.user,
      },
    } as ProtectedContext,
  })
}) as typeof t.procedure
