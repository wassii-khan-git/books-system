import React, { useRef, useState } from 'react'
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

export default function AddCategoryForm({ className, ...props }: React.ComponentProps<'div'>) {
  // preview
  const [preview, setPreview] = useState<string | null>(null)
  // form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      description: '',
      slug: ''
    }
  })

  const inputFileRef = useRef<HTMLInputElement>(null)

  // Auto-generate slug from title
  const watchedTitle = form.watch('title')
  React.useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      form.setValue('slug', slug)
    }
  }, [watchedTitle, form])

  // Handle image change for preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form reset
  const handleFormReset = () => {
    form.reset()
    setPreview(null)
    // set the image field empty
    if (inputFileRef.current) {
      inputFileRef.current.value = ''
    }
  }

  async function onSubmit(values: CategoryFormValues) {
    try {
      console.log('category data to submit:', values)

      // Create FormData for server action
      const formData = new FormData()
      formData.append('title', values.title)
      formData.append('slug', values.slug)
      formData.append('description', values.description)
      formData.append('image', values.image)

      // Call server action
      const result = await window.api?.addCategory(formData)

      if (result.success) {
        // Reset form after successful submission
        handleFormReset()
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Error adding category. Please try again.')
    }
  }

  return (
    <div className={cn('mx-6', className)} {...props}>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input className="mt-2" placeholder="category-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { ref, value, onChange, ...fieldProps } }) => {
                  void ref
                  void value
                  void onChange
                  return (
                    <FormItem>
                      <FormLabel>Image *</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-2"
                          ref={inputFileRef}
                          {...fieldProps}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="cursor-pointer mt-2"
                        />
                      </FormControl>
                      <FormMessage />
                      {preview && (
                        <div className="mt-2">
                          <img
                            width={150}
                            height={100}
                            src={preview}
                            alt="Preview"
                            className=" rounded border"
                          />
                        </div>
                      )}
                    </FormItem>
                  )
                }}
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFormReset}
                  disabled={form.formState.isSubmitting}
                  className="hover:text-indigo-500"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="min-w-[120px] bg-indigo-500 hover:bg-indigo-400"
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
  )
}
