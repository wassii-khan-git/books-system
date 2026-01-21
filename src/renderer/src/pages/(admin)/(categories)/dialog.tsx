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
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ChangeEvent, useEffect, useState } from 'react'
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
}: EditCategoryDialogProps) {
  // form
  const form = useForm({
    defaultValues: {
      title: category?.title,
      description: category?.desc
    }
  })
  // has new Image
  const [hasNewImage, setHasNewImage] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  // preview state
  const [preview, setPreview] = useState<string>('')
  // submit button
  const submitButtonText = action === 'edit' ? 'Save' : 'Yes'

  // For update
  const handleUpdate = async (values) => {
    console.log('values: ', values)
    const { image, description, ...rest } = values
    console.log('image:', image)

    // form
    let imageFileString: string | File
    //  if its file
    if (hasNewImage && values.image instanceof File) {
      imageFileString = values.image
    } else if (category?.img) {
      imageFileString = category.img
    } else {
      imageFileString = ''
    }

    const data = {
      ...rest,
      id: category?.id as string,
      desc: description,
      img: imageFileString
    }

    const formData = new FormData()
    formData.set('title', data.title)
    formData.set('slug', data.slug)
    formData.set('desc', data.desc)
    formData.set('image', data.img)

    try {
      // call update action
      const result = await window.api?.updateCategory(formData)
      console.log('result: ', result)
      // call on save
      onSave({ success: result.success, message: result.message })
    } catch (error) {
      console.log('Error:', error)
    }
  }
  // For delete
  const handeDelete = async () => {
    // data
    try {
      setLoading(true)
      // call delete action
      const result = await window.api?.deleteCategory(
        category?.id as string,
        category?.imgPublicId as string
      )
      console.log('result: ', result)
      onSave({ success: result.success, message: result.message })
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  // handle image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue('image', file)
      setHasNewImage(true)
      // update the state
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      return reader.readAsDataURL(file)
    }
  }

  // Auto-generate slug from title
  const watchedTitle = form.watch('title')

  useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      form.setValue('slug', slug)
    }
  }, [watchedTitle, form])

  useEffect(() => {
    if (open) {
      setPreview(category?.img as string)
      setLoading(false)
      form.reset()
    }
  }, [open, category?.img, form])

  const handleDialogClose = () => {
    form.reset()
    setPreview('')
    onOpenChange(false)
  }

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    defaultValue={category?.title}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    defaultValue={category?.slug}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug *</FormLabel>
                        <FormControl>
                          <Input placeholder="category-slug" {...field} />
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
                  defaultValue={category?.desc}
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
                  defaultValue={category?.img}
                  render={({ field: { value, onChange, ...fieldProps } }) => {
                    void value // Intentionally unused
                    void onChange // Intentionally unused
                    return (
                      <FormItem>
                        <FormLabel>Image *</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <FormMessage />
                        {preview && (
                          <div className="mt-2">
                            <img
                              width={120}
                              height={80}
                              src={preview}
                              alt="Preview"
                              className="rounded border"
                            />
                          </div>
                        )}
                      </FormItem>
                    )
                  }}
                />
              </div>
            ) : (
              action === 'delete' && <h3>Are your sure your want to delete this record ?</h3>
            )}

            <Separator className="mt-6 mb-5" />
            <DialogFooter>
              <div className="flex justify-end gap-2 items-center">
                <Button type="button" variant="outline" onClick={handleDialogClose} className="">
                  Cancel
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  type={action === 'edit' ? 'submit' : 'button'}
                  variant={action === 'edit' ? 'default' : 'destructive'}
                  onClick={() => action !== 'edit' && handeDelete()}
                  className="flex bg-indigo-500 hover:bg-indigo-400 "
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
