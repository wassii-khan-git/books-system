// Fixed validation schema - (validation)/validation.ts
import { z } from 'zod'

export const categorySchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500)
})

export type CategoryFormValues = z.infer<typeof categorySchema>
