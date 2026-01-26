// src/components/layout/common/dialogs/edit-company-dialog.tsx
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
import { JSX, useEffect, useState } from 'react'
import Spinner from '@/components/shared/spinner'
import { Tag, Trash2 } from 'lucide-react'
import { CompanyTypes } from './columns'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Combobox } from '@/components/ui/combobox'
import { Category } from '../(categories)/columns'
import { ResponseTypes } from 'src/main/types'

interface EditcompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: CompanyTypes | null
  onSave: (result: ResponseTypes) => void
  action: string
  page: number
  limit: number
}

export default function CompanyDialog({
  open,
  onOpenChange,
  company,
  onSave,
  action,
  page,
  limit
}: EditcompanyDialogProps): JSX.Element {
  // form
  const form = useForm({
    defaultValues: {
      name: company?.name,
      categoryId: String(company?.categoryId),
      percentage: String(company?.percentage)
    }
  })
  const [loading, setLoading] = useState<boolean>(false)

  const isDelete = action === 'delete'
  const dialogTitle = isDelete ? 'Delete company' : 'Update company'
  const dialogDescription = isDelete
    ? 'This action permanently removes the company and cannot be undone.'
    : 'Refine the company name and description for your library.'

  // submit button
  const submitButtonText = isDelete ? 'Delete' : 'Save'

  // For update
  const handleUpdate = async (values): Promise<void> => {
    console.log('values: ', values)
    setLoading(true)
    const data = {
      ...values,
      id: company?.id as string
    }
    console.log('data--', data)

    try {
      // call update action
      const result = await window.api?.updateCompany(data)
      console.log('result: ', result)
      setLoading(false)
      // call on save
      onSave({ success: result.success, message: result.message })
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  // For delete
  const handeDelete = async (id: number): Promise<void> => {
    // data
    console.log('iddd in delete---', id)

    try {
      setLoading(true)
      // call delete action
      const result = await window.api?.deleteCompany(id)
      console.log('result: ', result)
      onSave({ success: result.success, message: result.message, data: result.data })
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  // get categories
  const { data: categories } = useQuery({
    queryKey: ['categories', page, limit],
    queryFn: async () => {
      const result = await window.api?.getCategories({ page: 1, limit: 50 })
      return result
    },
    enabled: !!page || !!limit || open
  })

  // delete company
  const { isPending: isDeleting } = useMutation({
    mutationKey: ['delete-company'],
    mutationFn: async () => {
      const result: ResponseTypes = await window.api?.deleteCompany(Number(company?.id))
      // if result is success
      if (result.success) {
        onSave({ success: result.success, message: result.message, data: result.data })
      } else {
        onSave({ success: result.success, message: result.message, data: result.data })
      }
    }
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: company?.name,
        categoryId: String(company?.categoryId),
        percentage: String(company?.percentage)
      })
    }
  }, [open, company, form])

  const handleDialogClose = (): void => {
    form.reset()
    onOpenChange(false)
  }

  console.log('cagtegory-=--', company)
  console.log('Aciton---', action)
  console.log('categories---', categories)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180 gap-0 overflow-hidden border-border/70 bg-card/95 p-0">
        <DialogHeader className="gap-3 border-b border-border/60 bg-linear-to-b from-muted/40 to-transparent px-6 pb-4 pt-6 text-left">
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
                    name="name"
                    defaultValue={company?.name}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                          Name *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company title" {...field} />
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
                      <FormItem className=" flex flex-col">
                        <FormLabel>Category *</FormLabel>
                        <FormControl className="flex">
                          <Combobox
                            // Map your API data to label/value pairs
                            items={
                              categories?.data?.map((cat: Category) => ({
                                label: cat.title,
                                value: String(cat.id)
                              })) || []
                            }
                            value={String(field.value)}
                            onSelect={field.onChange} // Updates React Hook Form state
                            placeholder="Select a category"
                          />
                        </FormControl>
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
                          <Input
                            defaultValue={company?.percentage}
                            className="mt-2"
                            placeholder="Enter percentage"
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
                      <span className="font-semibold text-destructive">{company?.name}</span>.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This action cannot be undone and will remove the company from your catalog.
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
                className="min-w-25"
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
                    handeDelete(Number(company?.id))
                  }
                }}
                className="min-w-27.5"
              >
                {loading || form.formState.isSubmitting || isDeleting ? (
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
