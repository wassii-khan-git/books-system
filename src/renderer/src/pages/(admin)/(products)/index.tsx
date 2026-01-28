import React, { JSX, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { getColumns, ProductTypes } from './columns'
import ProductDialog from './dialog'
import { ResponseTypes } from 'src/main/types'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type ProductPropTypes = {
  page: number
  limit: number
  total?: number
}

const ProductsPage = (): JSX.Element => {
  // query client
  const queryClient = useQueryClient()
  // open
  const [open, setOpen] = useState<boolean>(false)
  const [selectedProduct, setselectedProduct] = useState<ProductTypes | null>(null)
  // router
  const [action, setAction] = useState<string>('')
  // get url params
  const [searchParams] = useSearchParams()

  // navigate
  const navigate = useNavigate()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 5

  // handle edit
  const handleEdit = (data: ProductTypes): void => {
    setselectedProduct(data)
    navigate(`/dashboard/add-product?productId=${data.id}`)
    console.log('data- in hadle edit--', data)
  }

  // handle delete
  const handleDelete = (data: ProductTypes): void => {
    setAction('delete')
    setOpen(true)
    setselectedProduct(data)
    console.log('data- in hadle delet--', data)
  }

  // handle on save
  const onSave = async (result: ResponseTypes): Promise<void> => {
    setOpen(false)
    console.log('result00- on save--', result)

    if (action === 'delete') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
        if (selectedProduct?.id !== null) {
          // refresh products
          queryClient.invalidateQueries({ queryKey: ['products', page, limit] })
        }
      } else {
        toast.error(result.message)
      }
    }
  }

  const { data: products } = useQuery({
    queryKey: ['products', page, limit],
    queryFn: async () => {
      const result: ResponseTypes = await window.api?.getProducts({ page, limit })
      return result
    },
    enabled: !!page || !!limit
  })

  // columns
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })
  console.log('searchParams---', searchParams)

  console.log('productiisss00--', products)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">All Products</h1>
            <Link to="/dashboard/add-product">
              <Button variant="outline" size="sm">
                <Plus />
                <span className="hidden lg:inline">Add Product</span>
              </Button>
            </Link>
          </div>
          {/* All products */}
          <DataTable
            columns={columns}
            data={products?.data || []}
            page={page}
            limit={limit}
            total={products?.pagination?.total as number}
          />
          {/* company Dialog */}
          <ProductDialog
            open={open}
            onOpenChange={setOpen}
            product={selectedProduct}
            onSave={onSave}
            action={action}
            page={page}
            limit={limit}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
