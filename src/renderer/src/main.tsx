import './main.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner'
import App from './app'
import { ThemeProvider } from './components/theme-provider'
// root
const root = document.getElementById('root') as HTMLElement

createRoot(root!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  </StrictMode>
)
