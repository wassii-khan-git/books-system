import React, { JSX, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { Category, getColumns } from './columns'
import CategoryDialog from './dialog'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type CategoryPageProps = {
  page: number
  limit: number
  total?: number
}

const CategoriesPage = (): JSX.Element => {
  // query client
  const queryClient = useQueryClient()
  // open
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  // router
  const [action, setAction] = useState<string>('')
  // get url params
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 5

  // handle edit
  const handleEdit = (data: Category): void => {
    setOpen(true)
    setAction('edit')
    setSelectedCategory(data)
    console.log('data- in hadle edit--', data)
  }

  // handle delete
  const handleDelete = (data: Category): void => {
    setAction('delete')
    setOpen(true)
    setSelectedCategory(data)
    console.log('data- in hadle delet--', data)
  }

  // handle on save
  const onSave = async (result): Promise<void> => {
    setOpen(false)
    console.log('result00- on save--', result)

    // check the action
    if (action === 'edit') {
      // call edit action
      if (result.success) {
        toast.success(result.message)
        // filter categories
        queryClient.invalidateQueries({ queryKey: ['categories', page, limit] })
      } else {
        toast.error(result.message)
      }
    } else if (action === 'delete') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
        if (selectedCategory?.id !== null) {
          // filter categories
          queryClient.invalidateQueries({ queryKey: ['categories', page, limit] })
        }
      } else {
        toast.error(result.message)
      }
    }
  }

  // get all categories
  const { data: categories } = useQuery({
    queryKey: ['categories', page, limit],
    queryFn: async () => await window.api?.getCategories({ page, limit }),
    enabled: !!page || !!limit
  })

  console.log('searchParams---', searchParams)

  // columns
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">All Categories</h1>
            <Link to="/dashboard/add-category">
              <Button variant="outline" size="sm">
                <Plus />
                <span className="hidden lg:inline">Add Category</span>
              </Button>
            </Link>
          </div>
          {/* All categories */}
          <DataTable
            columns={columns}
            data={categories?.data || []}
            page={page}
            limit={limit}
            total={categories?.pagination?.total as number}
          />
          {/* Category Dialog */}
          <CategoryDialog
            open={open}
            onOpenChange={setOpen}
            category={selectedCategory}
            onSave={onSave}
            action={action}
          />
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
