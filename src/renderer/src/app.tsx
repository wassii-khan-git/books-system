import { JSX, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DashboardLayout from './layouts/dashboard.layout'
import AuthLayout from './layouts/auth.layout'

import dashboardRoutes from './routes/dashboard.routes'
import authRoutes from './routes/auth.routes'
import Spinner from './components/shared/spinner'
import { useAuthStore } from './store/auth.slice'

const App = (): JSX.Element => {
  // store
  const { isAuthenticated, fetchSession, isLoading } = useAuthStore()

  console.log('isAuthenticated---', isAuthenticated)

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

  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 h-screen">
        <Spinner isPageLoader={true} size={50} />
      </div>
    )
  }

  return <RouterProvider router={router} />
}
export default App
