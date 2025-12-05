import { Context } from '@foundation-trpc/types'
import { signup } from '../../services/auth/sign-up.service'
import { SignupResponse } from '@foundation-trpc/types'
import { signupSchema } from '@foundation-trpc/types'
import z from 'zod'

export async function SignupController(
  input: z.infer<typeof signupSchema>,
  ctx: Context,
): Promise<SignupResponse> {
  console.log('incoming signup request.')
  try {
    const result = await signup(input)
    if (result.success && result.cookies) {
      console.log('cookies after singup in controller: ', result.cookies)
      ctx.res.setHeader('Set-Cookie', result.cookies)
    }
    return result
  } catch (error) {
    console.log('error: ', error)
    return {
      success: false,
      message: 'Something went wrong.',
      inputs: { ...input },
    }
  }
}
