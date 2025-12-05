import z from 'zod'
import { Context } from '@foundation-trpc/types'
import { signinSchema } from '@foundation-trpc/types'
import { signin } from '../../services/auth/sign-in.service'
import { SigninResponse } from '@foundation-trpc/types'

export async function SigninController(
  input: z.infer<typeof signinSchema>,
  ctx: Context,
): Promise<SigninResponse> {
  console.log('incoming singin request.')
  try {
    console.log('forwarding it to service')
    const result = await signin(input)
    console.log('received response from service')
    if (result.success && result.cookies) {
      console.log('setting cookie: ')
      console.log('cookie received from service: ', result.cookies)
      ctx.res.setHeader('Set-Cookie', result.cookies)
      console.log('cookei set.')
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
