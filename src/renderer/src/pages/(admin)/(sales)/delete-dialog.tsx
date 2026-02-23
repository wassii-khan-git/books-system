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
import { Separator } from '@/components/ui/separator'
import { JSX, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ResponseTypes } from 'src/main/types'

interface SoldItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sales: any
}

// Sold Items Dialog
export default function SoldItemsDialog({
  open,
  onOpenChange,
  sales
}: SoldItemsDialogProps): JSX.Element {
  // query client
  const queryClient = useQueryClient()
  // loading
  const [loading, setLoading] = useState<boolean>(false)

  // handle close
  const handleDialogClose = (): void => {
    onOpenChange(false)
  }

  const { mutate: deleteSale } = useMutation({
    mutationFn: async () => {
      try {
        setLoading(true)
        // call delete action
        const result: ResponseTypes = await window.api.deleteSoldItem(sales.id)
        console.log('result in dialogss: ', result)
        if (result.success) {
          // refetch
          queryClient.invalidateQueries({ queryKey: ['soldItems'] })
          // close dialog
          onOpenChange(false)
        }
      } catch (error) {
        console.log('Error:', error)
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (open) {
      setLoading(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Sales Record</DialogTitle>
          <DialogDescription className="sr-only">
            Delete sales record confirmation
          </DialogDescription>
        </DialogHeader>
        <Separator className="" />
        Are you sure you want to delete this record?
        <Separator className="" />
        <DialogFooter>
          <div className="flex justify-end gap-2 items-center">
            <Button type="button" variant="outline" onClick={handleDialogClose}>
              Cancel
            </Button>

            <Button
              type={'button'}
              variant={'destructive'}
              onClick={() => {
                deleteSale()
              }}
              size="sm"
            >
              {loading ? <LoaderCircle className="animate-spin h-5 w-5" size={30} /> : 'Yes'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
