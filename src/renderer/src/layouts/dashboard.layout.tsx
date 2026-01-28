import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import TitleBar from '@/components/titlebar'
import { JSX } from 'react'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout(): JSX.Element {
  return (
    <div className="md:ml-72">
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)'
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" className="w-72" />
        <SidebarInset>
          <TitleBar />
          <main className="w-full md:max-w-7xl mx-auto px-4 pb-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
