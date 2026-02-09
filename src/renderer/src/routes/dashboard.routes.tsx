import { lazy } from 'react'
import HomePage from '@/pages/(admin)/home'
import { Navigate } from 'react-router-dom'
import SalesPage from '@/pages/(admin)/(sales)'
import InvoicePage from '@/pages/(admin)/(sales)/invoice'
import SoldItemsPage from '@/pages/(admin)/(sales)/sold-items'

// imports
const AddCategoryPage = lazy(() => import('@/pages/(admin)/(add-category)/index'))
const CategoriesPage = lazy(() => import('@/pages/(admin)/(categories)'))
const AddCompanyPage = lazy(() => import('@/pages/(admin)/(add-company)/index'))
const CompaniesPage = lazy(() => import('@/pages/(admin)/(companies)/index'))
const AddProductPage = lazy(() => import('@/pages/(admin)/(add-product)/index'))
const ProductsPage = lazy(() => import('@/pages/(admin)/(products)/index'))

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
    path: 'dashboard/add-company',
    element: <AddCompanyPage />
  },
  {
    path: 'dashboard/companies',
    element: <CompaniesPage />
  },
  {
    path: 'dashboard/add-product',
    element: <AddProductPage />
  },
  {
    path: 'dashboard/products',
    element: <ProductsPage />
  },
  {
    path: 'dashboard/sales',
    element: <SalesPage />
  },
  {
    path: 'dashboard/sales/invoice/:saleId',
    element: <InvoicePage />
  },
  {
    path: 'dashboard/sales/sold-items',
    element: <SoldItemsPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]

export default dashboardRoutes
