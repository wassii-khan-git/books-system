import React, { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { Category, getColumns } from './columns'
import CategoryDialog from './dialog'

const MainCategories = () => {
  // open
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  // router
  const [action, setAction] = useState<string>('')
  // handle edit
  const handleEdit = (data: Category) => {
    setOpen(true)
    setAction('edit')
    setSelectedCategory(data)
  }
  // handle delete
  const handleDelete = (data: Category) => {
    setAction('delete')
    setOpen(true)
    setSelectedCategory(data)
  }

  // handle on save
  const onSave = async (result): Promise<void> => {
    setOpen(false)
    // check the action
    if (action === 'edit') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } else if (action === 'delete') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
  }

  // columns
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })
  return (
    <>
      <DataTable columns={columns} data={[]} page={1} limit={1} total={10} />
      {/* Category Dialog */}
      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        category={selectedCategory}
        onSave={onSave}
        action={action}
      />
    </>
  )
}

export default MainCategories
