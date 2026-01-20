import z from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, '  Password must be atleast 6 characters long').max(255)
})

export type loginSchemaTypes = z.infer<typeof loginSchema>
