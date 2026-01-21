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
import { Checkbox } from '@/components/ui/checkbox'
import { MoreVertical, Pen, Trash } from 'lucide-react'

// Define the shape of your Category data
export type Category = {
  id: string // Assuming UUID from Prisma
  title: string
  slug: string
  desc: string
  img?: string | File
  imgPublicId?: string
}

interface columnsProps {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export const getColumns = ({ onEdit, onDelete }: columnsProps): ColumnDef<Category>[] => [
  // Column for Dragging
  // {
  //   id: "drag",
  //   header: () => null,
  //   cell: ({ row }) => <DragHandle id={row.original.id} />,
  // },
  // Column for Row Selection
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  // Column for Title
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>
  },
  // Column for Slug
  {
    accessorKey: 'slug',
    header: 'Slug',
    cell: ({ row }) => <div className="font-mono">{row.original.slug}</div>
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
