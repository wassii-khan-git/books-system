import React, { JSX, useEffect, useState } from 'react'
import { DataTable } from '@/components/data-table'
import { toast } from 'sonner'
import { CompanyTypes, getColumns } from './columns'
import CompanyDialog from './dialog'
import { ResponseTypes } from 'src/main/types'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type ompanyPageProps = {
  page: number
  limit: number
  total?: number
}

const CompaniesPage = (): JSX.Element => {
  // query client
  const queryClient = useQueryClient()
  // open
  const [open, setOpen] = useState<boolean>(false)
  const [selectedCompany, setSelectedCompany] = useState<CompanyTypes | null>(null)
  // router
  const [action, setAction] = useState<string>('')
  // get url params
  const [searchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 5

  // handle edit
  const handleEdit = (data: CompanyTypes): void => {
    setOpen(true)
    setAction('edit')
    setSelectedCompany(data)
    console.log('data- in hadle edit--', data)
  }

  // handle delete
  const handleDelete = (data: CompanyTypes): void => {
    setAction('delete')
    setOpen(true)
    setSelectedCompany(data)
    console.log('data- in hadle delet--', data)
  }

  // handle on save
  const onSave = async (result: ResponseTypes): Promise<void> => {
    setOpen(false)
    console.log('result00- on save--', result)

    // check the action
    if (action === 'edit') {
      // call edit action
      if (result.success) {
        toast.success(result.message)
        // refresh companies
        queryClient.invalidateQueries({ queryKey: ['companies', page, limit] })
      } else {
        toast.error(result.message)
      }
    } else if (action === 'delete') {
      // call delete action
      if (result.success) {
        toast.success(result.message)
        if (selectedCompany?.id !== null) {
          // filter companies
          // refresh companies
          queryClient.invalidateQueries({ queryKey: ['companies', page, limit] })
        }
      } else {
        toast.error(result.message)
      }
    }
  }

  const { data: companies } = useQuery({
    queryKey: ['companies', page, limit],
    queryFn: async () => {
      const result: ResponseTypes = await window.api?.getCompanies({ page, limit })
      return result
    },
    enabled: !!page || !!limit
  })

  // columns
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })
  console.log('searchParams---', searchParams)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">All Companies</h1>
            <Link to="/dashboard/add-company">
              <Button variant="outline" size="sm">
                <Plus />
                <span className="hidden lg:inline">Add Company</span>
              </Button>
            </Link>
          </div>
          {/* All companies */}
          <DataTable
            columns={columns}
            data={companies?.data || []}
            page={page}
            limit={limit}
            total={companies?.pagination?.total as number}
          />
          {/* company Dialog */}
          <CompanyDialog
            open={open}
            onOpenChange={setOpen}
            company={selectedCompany}
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

export default CompaniesPage
