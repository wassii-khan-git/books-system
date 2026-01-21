import './main.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner'
import App from './app'
// root
const root = document.getElementById('root') as HTMLElement

createRoot(root!).render(
  <StrictMode>
    <App />
    <Toaster richColors position="top-right" />
  </StrictMode>
)
