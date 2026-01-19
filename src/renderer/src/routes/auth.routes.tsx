import LoginPage from '@/pages/(auth)/login'
import SignupPage from '@/pages/(auth)/sign-up'

const authRoutes = {
  path: '/',
  element: <LoginPage />,
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
