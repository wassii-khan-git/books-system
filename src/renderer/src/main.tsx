import './main.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner'
import router from './routes'
// root
const root = document.getElementById('root') as HTMLElement

createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster richColors position="top-right" />
  </StrictMode>
)
