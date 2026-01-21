'use server'

import { JSX } from 'react'
import AddCategoryForm from './add-category'

export default function AddCategoryPage(): JSX.Element {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">Add category</h1>
          </div>
          <AddCategoryForm />
        </div>
      </div>
    </div>
  )
}
