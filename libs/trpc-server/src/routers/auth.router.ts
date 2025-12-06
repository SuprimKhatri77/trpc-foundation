import { APIError, fromNodeHeaders } from '@foundation-trpc/auth'
import { SignupController, SigninController } from '@foundation-trpc/core'
import {
  signinResponseSchema,
  signoutResponseSchema,
  signupResponseSchema,
  signinSchema,
  signupSchema,
} from '@foundation-trpc/types'
import { protectedProcedure, publicProcedure, router } from './trpc'

export const authRoutes = router({
  signup: publicProcedure
    .input(signupSchema)
    .output(signupResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return SignupController(input, ctx)
    }),
  signin: publicProcedure
    .input(signinSchema)
    .output(signinResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return SigninController(input, ctx)
    }),
  getUserSession: protectedProcedure.query(async ({ input, ctx }) => {
    if (!ctx.session || !ctx.session.user) {
      return {
        success: false,
        message: 'User not found.',
        session: ctx.session,
      }
    }
    return { success: true, session: ctx.session }
  }),
  signout: protectedProcedure
    .output(signoutResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const headers = fromNodeHeaders(ctx.req.headers)
      try {
        await ctx.auth.api.signOut({
          headers,
        })

        ctx.res.clearCookie('better-auth.session_token')

        return { success: true, message: 'Signed out successfully.' }
      } catch (error) {
        if (error instanceof APIError) {
          console.log('error message: ', error.message)
          return { success: false, message: error.message }
        }
        return { success: false, message: 'Failed to signout.' }
      }
    }),
})
