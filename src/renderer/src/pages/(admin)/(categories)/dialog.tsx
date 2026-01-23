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
import { Tag, Trash2 } from 'lucide-react'

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

  const isDelete = action === 'delete'
  const dialogTitle = isDelete ? 'Delete Category' : 'Update Category'
  const dialogDescription = isDelete
    ? 'This action permanently removes the category and cannot be undone.'
    : 'Refine the category name and description for your library.'

  // submit button
  const submitButtonText = isDelete ? 'Delete' : 'Save'

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
      <DialogContent className="max-w-[720px] gap-0 overflow-hidden border-border/70 bg-card/95 p-0">
        <DialogHeader className="gap-3 border-b border-border/60 bg-gradient-to-b from-muted/40 to-transparent px-6 pb-4 pt-6 text-left">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                isDelete ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'
              }`}
            >
              {isDelete ? <Trash2 className="h-5 w-5" /> : <Tag className="h-5 w-5" />}
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {dialogTitle}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {dialogDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <div className="px-6 py-5">
              {action === 'edit' ? (
                <div className="grid gap-5">
                  {/* Basic Information */}
                  <FormField
                    control={form.control}
                    name="title"
                    defaultValue={category?.title}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Title *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category title" {...field} />
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
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter category description"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                isDelete && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                    <p className="text-sm text-foreground">
                      You are about to delete{' '}
                      <span className="font-semibold text-destructive">
                        {category?.title}
                      </span>
                      .
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This action cannot be undone and will remove the category from your
                      catalog.
                    </p>
                  </div>
                )
              )}
            </div>

            <DialogFooter className="gap-2 border-t border-border/60 bg-muted/30 px-6 py-4 sm:items-center sm:gap-3 sm:space-x-0">
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={form.formState.isSubmitting || loading}
                type={isDelete ? 'button' : 'submit'}
                variant={isDelete ? 'destructive' : 'default'}
                onClick={() => {
                  if (isDelete) {
                    handeDelete(category?.id as number)
                  }
                }}
                className="min-w-[110px]"
              >
                {loading || form.formState.isSubmitting ? (
                  <Spinner
                    isPageLoader={false}
                    size={22}
                    className={isDelete ? 'text-destructive-foreground' : 'text-primary-foreground'}
                  />
                ) : (
                  submitButtonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
