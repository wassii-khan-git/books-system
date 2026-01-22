import React, { JSX } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// shadcn/ui form components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { CategoryFormValues, categorySchema } from './validations'
import Spinner from '@/components/shared/spinner'

export default function AddCategoryForm({
  className,
  ...props
}: React.ComponentProps<'div'>): JSX.Element {
  // form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  async function onSubmit(values: CategoryFormValues): Promise<void> {
    try {
      console.log('category data to submit:', values)
      // Call server action
      const result = await window.api?.addCategory(values)
      console.log('result', result)
      if (result.success) {
        // Reset form after successful submission
        form.reset()
        toast.success(result.message || 'Category added successfully')
      } else {
        toast.error(result.message || 'Error adding category. Please try again.')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Error adding category. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">Add category</h1>
          </div>
          <div className={cn('mx-6', className)} {...props}>
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input className="mt-2" placeholder="Enter category title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter category description"
                              className="min-h-25 mt-2"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={form.formState.isSubmitting}
                        className="hover:text-primary"
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="bg-primary"
                      >
                        {form.formState.isSubmitting ? (
                          <Spinner isPageLoader={false} size={25} className="text-white" />
                        ) : (
                          'Add Category'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
