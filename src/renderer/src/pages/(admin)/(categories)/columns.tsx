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

// Define the shape of your Category data
export type Category = {
  id: string // Assuming UUID from Prisma
  title: string
  description: string
  createdAt?: string
  updatedAt?: string
}

interface columnsProps {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export const getColumns = ({ onEdit, onDelete }: columnsProps): ColumnDef<Category>[] => [
  // Column for Dragging
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />
  },
  // Column for Row Selection

  // Column for Title
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
  },

  // Column for description
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <div className="font-medium">{row.original.description}</div>
  },

  // Column for Actions
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const category = row.original
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
                <DropdownMenuItem onClick={() => onEdit(category)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => onDelete(category)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden md:flex md:gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
              <Pen />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(category)}>
              <Trash />
            </Button>
          </div>
        </>
      )
    }
  }
]
