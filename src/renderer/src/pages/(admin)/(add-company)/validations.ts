// Fixed validation schema - (validation)/validation.ts
import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  categoryId: z.string().min(1, 'Please select a category'),
  percentage: z
    .string()
    .min(1, 'Percentage is required')
    .refine((val) => {
      const num = Number(val)
      return !isNaN(num) && num >= 0 && num <= 100
    }, 'Percentage must be a number between 0 and 100')
})

export type companyFormValues = z.infer<typeof companySchema>
