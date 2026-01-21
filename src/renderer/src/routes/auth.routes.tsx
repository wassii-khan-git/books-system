import { LoginPage } from '@/pages/(auth)/login'
import { Navigate } from 'react-router-dom'

const authRoutes = [
  {
    index: true,
    element: <LoginPage />
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]

export default authRoutes
