import './main.css'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { StrictMode } from 'react'
// root
const root = document.getElementById('root') as HTMLElement

createRoot(root!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
