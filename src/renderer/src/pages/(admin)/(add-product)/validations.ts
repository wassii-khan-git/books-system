// Fixed validation schema - (validation)/validation.ts
import { z } from 'zod'

// Define the validation schema based on ProductItemTypes
export const productSchema = z.object({
  id: z.string().optional(),
  companyId: z.number().min(1, 'Company is required'),
  categoryId: z.number().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),

  author: z.string().min(1, 'Author is required').max(100, 'Author name too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description too long'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0, 'Quantity must be 0 or greater').optional(),
  isbn: z
    .string()
    .min(10, 'ISBN must be at least 10 characters')
    .max(13, 'ISBN too long')
    .regex(/^\d+$/, 'ISBN must contain only numbers')
    .optional(),
  pages: z.number().int().min(1, 'Pages must be at least 1'),
  language: z.string().min(1, 'Language is required'),
  publisher: z.string().optional().or(z.literal('')),
  inStock: z.boolean(),
  off: z.number().min(0).max(100, 'Discount cannot exceed 100%')
})

export type ProductFormValues = z.infer<typeof productSchema>
