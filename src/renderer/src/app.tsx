import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard.layout'
import AuthLayout from './layouts/auth.layout'

import { useAuthStore } from './store/auth.slice'
import dashboardRoutes from './routes/dashboard.routes'
import authRoutes from './routes/auth.routes'

const App = () => {
  const { isAuthenticated, fetchSession } = useAuthStore()

  // router
  const router = createBrowserRouter([
    {
      path: '/',
      // If authenticated, show Dashboard; otherwise, show Auth
      element: isAuthenticated ? <DashboardLayout /> : <AuthLayout />,
      children: isAuthenticated ? dashboardRoutes : authRoutes
    }
  ])

  // on load fetch session
  useEffect(() => {
    fetchSession()
  }, [])

  return <RouterProvider router={router} />
}
export default App
