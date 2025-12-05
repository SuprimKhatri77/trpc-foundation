import z from 'zod'

export const signupResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
  inputs: z
    .object({
      name: z.string().optional(),
      email: z.email().optional(),
      password: z.string().optional(),
    })
    .optional(),
  cookies: z.string().optional(),
  redirectTo: z.string().optional(),
  errors: z
    .object({
      properties: z
        .object({
          name: z.array(z.string()).optional(),
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
})

export const signinResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
  inputs: z
    .object({
      email: z.email().optional(),
      password: z.string().optional(),
    })
    .optional(),
  cookies: z.string().optional(),
  redirectTo: z.string().optional(),
  errors: z
    .object({
      properties: z
        .object({
          email: z.array(z.string()).optional(),
          password: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
})

export const signoutResponseSchema = z.object({
  success: z.boolean().nonoptional(),
  message: z.string().trim().nonempty(),
})
export type SignupResponse = z.infer<typeof signupResponseSchema>
export type SigninResponse = z.infer<typeof signinResponseSchema>
