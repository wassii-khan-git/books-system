import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { JSX } from 'react'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout(): JSX.Element {
  // loading

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
          <SiteHeader />
          <main className="w-full md:max-w-7xl mx-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
