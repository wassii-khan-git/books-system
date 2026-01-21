import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import MainCategories from './categories'

export default function CategoriesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex justify-between items-center px-4 lg:px-6">
            <h1 className="text-lg">All Categories</h1>
            <Link to="dashboard/add-category" className="hidden md:block">
              <Button variant="outline" size="sm">
                <Plus />
                <span className="hidden lg:inline">Add Category</span>
              </Button>
            </Link>
          </div>
          {/* All categories */}
          <MainCategories />
        </div>
      </div>
    </div>
  )
}
