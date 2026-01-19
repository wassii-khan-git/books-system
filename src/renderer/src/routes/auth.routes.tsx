import AuthLayout from '@/layouts/auth.layout'
import LoginPage from '@/pages/(auth)/login'
import SignupPage from '@/pages/(auth)/sign-up'

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
    },
    {
      path: 'signup',
      element: <SignupPage />
    }
  ]
}

export default authRoutes
