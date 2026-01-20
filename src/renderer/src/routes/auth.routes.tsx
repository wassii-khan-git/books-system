import AuthLayout from '@/layouts/auth.layout'
import { LoginPage } from '@/pages/(auth)/login'

const authRoutes = {
  path: '/',
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <LoginPage />
    },
    {
      path: 'login',
      element: <LoginPage />
    }
  ]
}

export default authRoutes
