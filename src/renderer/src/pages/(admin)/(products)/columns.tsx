// src/app/dashboard/categories/columns.tsx
'use client'

import { type ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Pen, Trash } from 'lucide-react'
import { DragHandle } from '@/components/data-table'
import { Category } from '../(categories)/columns'
import { CompanyTypes } from '../(companies)/columns'

// Define the shape of your company data
export type ProductTypes = {
  id: string // Assuming UUID from Prisma
  title: string
  author: string
  description: string
  publisher: string
  quantity: number
  companyId: number
  categoryId: number
  price: number
  originalPrice: number
  discountedPrice?: number
  percentage: number
  language: string
  isbn: string
  pages: number
  inStock: boolean
  off: number
  // relations
  category: Category
  company: CompanyTypes

  createdAt?: string
  updatedAt?: string
}

interface columnsProps {
  onEdit: (company: ProductTypes) => void
  onDelete: (company: ProductTypes) => void
}

export const getColumns = ({ onEdit, onDelete }: columnsProps): ColumnDef<ProductTypes>[] => [
  // Column for Dragging
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />
  },
  // Column for Row Selection

  // Column for name
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
  },

  // Column for description
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <div className="font-medium">{row.original?.category?.title}</div>
  },

  // Column for description
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => <div className="font-medium">{row.original?.company?.name}</div>
  },

  // Column for Percentage
  {
    accessorKey: 'percentage',
    header: 'Percentage',
    cell: ({ row }) => (
      <div className="font-medium">
        <span className="bg-primary text-white rounded-sm p-1.5 text-xs">
          {row.original?.off || 0} %
        </span>
      </div>
    )
  },

  // Column for Actions
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const company = row.original
      return (
        <>
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(company)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => onDelete(company)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex md:gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(company)}>
              <Pen />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(company)}>
              <Trash />
            </Button>
          </div>
        </>
      )
    }
  }
]
