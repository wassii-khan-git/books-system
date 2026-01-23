import React, { JSX, useCallback, useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { Category, getColumns } from './columns'
import CategoryDialog from './dialog'
import { ResponseTypes } from 'src/main/types'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export type CategoryPageProps = {
  page: number
  limit: number
  total?: number
}

const CategoriesPage = (): JSX.Element => {
  // open
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  // router
  const [action, setAction] = useState<string>('')
  // get url params
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 5

  // total
  const [total, setTotal] = useState<number>(0)

  // categories
  const [categories, setCategories] = useState<Category[]>([])

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
        await getCategories({ page, limit })
      } else {
        toast.error(result.message)
      }
    } else if (action === 'delete') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
        if (selectedCategory?.id !== null) {
          // filter categories
          const filteredCategories = categories.filter(
            (category) => category.id !== selectedCategory?.id
          )
          setCategories(filteredCategories.length > 0 ? filteredCategories : [])
        }
      } else {
        toast.error(result.message)
      }
    }
  }

  // get all categories
  const getCategories = async ({ page, limit }: CategoryPageProps): Promise<void> => {
    try {
      const categories: ResponseTypes = await window.api.getCategories({ page, limit })
      console.log('categories', categories)
      if (categories.success) {
        setCategories(categories.data?.length > 0 ? categories.data : [])
        setTotal(categories.pagination?.total as number)
      }
    } catch (error) {
      console.log('error--', error)
    }
  }

  useEffect(() => {
    getCategories({ page, limit })
  }, [searchParams, page, limit])

  console.log('searchParams---', searchParams)

  // columns
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })

  return (
    <>
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
              data={categories}
              page={page}
              limit={limit}
              total={total}
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
    </>
  )
}

export default CategoriesPage
