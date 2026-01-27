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
import { Button } from '@/components/ui/button'
import { JSX, useEffect, useState } from 'react'
import Spinner from '@/components/shared/spinner'
import { Tag, Trash2 } from 'lucide-react'
import { ProductTypes } from './columns'
import { useMutation } from '@tanstack/react-query'
import { ResponseTypes } from 'src/main/types'

interface EditcompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductTypes | null
  onSave: (result: ResponseTypes) => void
  action: string
  page: number
  limit: number
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  action
}: EditcompanyDialogProps): JSX.Element {
  // form

  const [loading, setLoading] = useState<boolean>(false)

  const isDelete = action === 'delete'
  const dialogTitle = isDelete ? 'Delete company' : 'Update company'
  const dialogDescription = isDelete
    ? 'This action permanently removes the company and cannot be undone.'
    : 'Refine the company name and description for your library.'

  // submit button
  const submitButtonText = isDelete ? 'Delete' : 'Save'

  // For delete
  const handeDelete = async (id: number): Promise<void> => {
    // data
    console.log('iddd in delete---', id)

    try {
      setLoading(true)
      // call delete action
      const result = await window.api?.deleteProduct(id)
      console.log('result: ', result)
      onSave({ success: result.success, message: result.message, data: result.data })
    } catch (error) {
      console.log('Error:', error)
      setLoading(false)
    }
  }

  // delete company
  const { isPending: isDeleting } = useMutation({
    mutationKey: ['delete-company'],
    mutationFn: async () => {
      const result: ResponseTypes = await window.api?.deleteProduct(Number(product?.id))
      // if result is success
      if (result.success) {
        onSave({ success: result.success, message: result.message, data: result.data })
      } else {
        onSave({ success: result.success, message: result.message, data: result.data })
      }
    }
  })

  const handleDialogClose = (): void => {
    onOpenChange(false)
  }
  useEffect(() => {
    setLoading(false)
  }, [open])

  console.log('product-=--', product)
  console.log('Aciton---', action)

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
        <div className="px-6 py-5">
          {action !== 'edit' && isDelete && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm text-foreground">
                You are about to delete{' '}
                <span className="font-semibold text-destructive">{product?.title}</span>.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                This action cannot be undone and will remove the company from your catalog.
              </p>
            </div>
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
            disabled={loading}
            type={isDelete ? 'button' : 'submit'}
            variant={isDelete ? 'destructive' : 'default'}
            onClick={() => {
              if (isDelete) {
                handeDelete(Number(product?.id))
              }
            }}
            className="min-w-27.5"
          >
            {loading || isDeleting ? (
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
      </DialogContent>
    </Dialog>
  )
}
