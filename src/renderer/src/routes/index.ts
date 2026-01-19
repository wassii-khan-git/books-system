import { isLoggedIn } from '@/config'
import { createBrowserRouter } from 'react-router'
import dashboardRoutes from './dashboard.routes'
import authRoutes from './auth.routes'

const protectedRoutes = [isLoggedIn ? dashboardRoutes : authRoutes]
// Router instance
const router = createBrowserRouter(protectedRoutes)

export default router
