import './main.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Toaster } from './components/ui/sonner'
import App from './app'
import { ThemeProvider } from './components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// root
const root = document.getElementById('root') as HTMLElement
// query client
const queryClient = new QueryClient()

createRoot(root!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
