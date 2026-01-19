import DashboardLayout from '@/layouts/dashboard.layout'
import HomePage from '@/pages/(admin)/home'
// import { lazy } from 'react'
// // pages
// const DashboardHome = lazy(() => import('../pages/dashboard/home'))
// const ProductsPage = lazy(() => import('../pages/dashboard/products'))

const dashboardRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    // Dashboard Home Page
    {
      index: true,
      element: <HomePage />
    },
    // Dashboard Home Page
    {
      path: 'dashboard',
      element: <HomePage />
    },
    // Dashboard Settings Page
    {
      path: '/home',
      element: <HomePage />
    }
  ]
}

export default dashboardRoutes
