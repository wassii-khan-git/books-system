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
import { companyFormValues, companySchema } from './validations'
import Spinner from '@/components/shared/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function AddCompanyForm({
  className,
  ...props
}: React.ComponentProps<'div'>): JSX.Element {
  // form
  const form = useForm<companyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      categoryId: '',
      percentage: ''
    }
  })

  async function onSubmit(values: companyFormValues): Promise<void> {
    try {
      console.log('company data to submit:', values)
      // Call server action
      const result = await window.api?.addCompany(values)
      console.log('result', result)
      if (result.success) {
        // Reset form after successful submission
        form.reset()
        toast.success(result.message || 'company added successfully')
      } else {
        toast.error(result.message || 'Error adding company. Please try again.')
      }
    } catch (error) {
      console.error('Error adding company:', error)
      toast.error('Error adding company. Please try again.')
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">Add Company</h1>
          </div>
          <div className={cn('mx-6', className)} {...props}>
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Company */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company *</FormLabel>
                          <FormControl>
                            <Input className="mt-2" placeholder="Enter company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl className="w-full">
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="select">Select</SelectItem>
                              {[].map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Percentage *</FormLabel>
                          <FormControl>
                            <Input className="mt-2" placeholder="Enter percentage" {...field} />
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
                          'Add company'
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
