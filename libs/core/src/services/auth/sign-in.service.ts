import z from 'zod'
import { signinSchema } from '@foundation-trpc/types'
import { SigninResponse } from '@foundation-trpc/types'
import { APIError, auth } from '@foundation-trpc/auth'

export async function signin(
  input: z.infer<typeof signinSchema>,
): Promise<SigninResponse> {
  console.log('received request from controller to signin.')
  const validateFields = signinSchema.safeParse({ ...input })
  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error).properties

    return {
      success: false,
      message: 'Validation failed.',
      inputs: { ...input },
      errors: {
        properties: {
          email: tree?.email?.errors,
          password: tree?.password?.errors,
        },
      },
    }
  }
  const { email, password } = validateFields.data
  try {
    const { headers } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      returnHeaders: true,
    })
    console.log('signin done now setting cookie.')
    const getCookie = headers.get('set-cookie') || ''
    console.log('cookie after signin: ', getCookie)
    return {
      success: true,
      message: 'Logged in successfully.',
      cookies: getCookie,
      redirectTo: '/authenticated',
    }
  } catch (error) {
    console.log('error: ', error)
    if (error instanceof APIError) {
      console.log('error message: ', error.message)
      return {
        success: false,
        message: error.message,
        inputs: { ...input },
      }
    }
    return {
      success: false,
      message: 'Failed to signin.',
      inputs: { ...input },
    }
  }
}
