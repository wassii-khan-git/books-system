import { lazy } from 'react'
import HomePage from '@/pages/(admin)/home'
import { Navigate } from 'react-router-dom'
// imports
const AddCategoryPage = lazy(() => import('@/pages/(admin)/(add-category)/index'))
const CategoriesPage = lazy(() => import('@/pages/(admin)/(categories)'))

const dashboardRoutes = [
  {
    index: true,
    element: <HomePage />
  },
  {
    path: 'dashboard',
    element: <HomePage />
  },
  {
    path: 'dashboard/add-category',
    element: <AddCategoryPage />
  },
  {
    path: 'dashboard/categories',
    element: <CategoriesPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]

export default dashboardRoutes
