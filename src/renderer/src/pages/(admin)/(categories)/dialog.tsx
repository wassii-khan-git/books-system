// src/components/layout/common/dialogs/edit-category-dialog.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { JSX, useEffect, useState } from 'react'
import { Category } from './columns'
import Spinner from '@/components/shared/spinner'

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (result: any) => void
  action: string
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
  action
}: EditCategoryDialogProps): JSX.Element {
  // form
  const form = useForm({
    defaultValues: {
      title: category?.title,
      description: category?.description
    }
  })

  const [loading, setLoading] = useState<boolean>(false)

  // submit button
  const submitButtonText = action === 'edit' ? 'Save' : 'Yes'

  // For update
  const handleUpdate = async (values): Promise<void> => {
    console.log('values: ', values)

    const data = {
      ...values,
      id: category?.id as string
    }

    console.log('data--', data)

    try {
      // call update action
      const result = await window.api?.updateCategory(data)
      console.log('result: ', result)
      // call on save
      onSave({ success: result.success, message: result.message })
    } catch (error) {
      console.log('Error:', error)
    }
  }
  // For delete
  const handeDelete = async (id: number): Promise<void> => {
    // data
    console.log('iddd in delete---', id)

    try {
      setLoading(true)
      // call delete action
      const result = await window.api?.deleteCategory(id)
      console.log('result: ', result)
      onSave({ success: result.success, message: result.message, data: result.data })
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      form.reset()
      setLoading(false)
    }
  }, [open, form])

  const handleDialogClose = (): void => {
    form.reset()
    onOpenChange(false)
  }

  console.log('cagtegory-=--', category)
  console.log('Aciton---', action)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{action === 'edit' ? 'Update Category' : 'Delete Category'}</DialogTitle>
          <DialogDescription className="sr-only">This is update category dialog</DialogDescription>
        </DialogHeader>
        <Separator className="mt-3 mb-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            {action === 'edit' ? (
              <div className="space-y-4 md:space-y-8 mb-2 md:mb-8">
                {/* Basic Information */}
                <FormField
                  control={form.control}
                  name="title"
                  defaultValue={category?.title}
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
                  defaultValue={category?.description}
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
              </div>
            ) : (
              action === 'delete' && (
                <h3>
                  Are your sure your want to delete{' '}
                  <span className="font-bold">{category?.title}</span> record ?
                </h3>
              )
            )}

            <Separator className="mt-6 mb-5" />
            <DialogFooter>
              <div className="flex justify-end gap-2 items-center">
                <Button size="sm" type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={form.formState.isSubmitting}
                  type={action === 'edit' ? 'submit' : 'button'}
                  variant={action === 'edit' ? 'default' : 'destructive'}
                  onClick={() => {
                    if (action === 'edit') {
                      handleUpdate()
                    } else if (action === 'delete') {
                      handeDelete(category?.id as number)
                    }
                  }}
                  className="flex bg-primary hover:bg-primary "
                >
                  {loading || form.formState.isSubmitting ? (
                    <Spinner isPageLoader={false} size={22} className="text-white" />
                  ) : (
                    submitButtonText
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
