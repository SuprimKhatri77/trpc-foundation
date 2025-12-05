import z from 'zod'
import { SignupResponse } from '@foundation-trpc/types'
import { signupSchema } from '@foundation-trpc/types'
import { APIError, auth } from '@foundation-trpc/auth'

export async function signup(
  input: z.infer<typeof signupSchema>,
): Promise<SignupResponse> {
  console.log('executing service now.')
  const validateFields = signupSchema.safeParse({
    ...input,
  })
  if (!validateFields.success) {
    const tree = z.treeifyError(validateFields.error).properties
    return {
      success: false,
      message: 'Validation failed.',
      inputs: { ...input },
      errors: {
        properties: {
          name: tree?.name?.errors,
          email: tree?.email?.errors,
          password: tree?.password?.errors,
        },
      },
    }
  }
  try {
    const { headers } = await auth.api.signUpEmail({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
      },
      returnHeaders: true,
    })
    const getCookie = headers.get('set-cookie') || ''
    console.log('cookie after signup: ', getCookie)
    return {
      success: true,
      message: 'Signed up successfully.',
      cookies: getCookie,
      redirectTo: '/authenticated',
    }
  } catch (error) {
    console.log('error: ', error)
    if (error instanceof APIError) {
      console.log('error: ', error.message)
      return {
        success: false,
        message: error.message,
        inputs: { ...input },
      }
    }
    return {
      success: false,
      message: 'Failed to signup.',
      inputs: { ...input },
    }
  }
}
