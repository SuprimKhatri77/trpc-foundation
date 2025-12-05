import z from 'zod'

export const signupSchema = z.object({
  email: z.email().nonempty(),
  name: z.string().trim().min(1),
  password: z.string().trim().min(3).nonempty(),
})

export const signinSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
})
