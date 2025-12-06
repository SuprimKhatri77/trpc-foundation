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

      const modifiedCookie = result.cookies.includes('Domain=')
        ? result.cookies
        : result.cookies + '; Domain=.onrender.com'

      console.log('modified cookie with domain: ', modifiedCookie)

      ctx.res.setHeader('Set-Cookie', modifiedCookie)
      ctx.res.setHeader('Access-Control-Allow-Credentials', 'true')

      console.log('cookie set.')
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
