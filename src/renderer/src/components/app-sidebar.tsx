'use client'

import React, { JSX } from 'react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import {
  IconBook2,
  IconBuildingStore,
  IconLayoutDashboard,
  IconMessageCircle,
  IconPackage,
  IconReceipt2,
  IconTags,
  IconUser
} from '@tabler/icons-react'
import { Link } from 'react-router-dom'

const dashboardNavigations = {
  navMain: [
    {
      title: 'Dashboard',
      url: 'dashboard',
      icon: IconLayoutDashboard,
      isActive: true
    },

    {
      title: 'Categories',
      url: 'dashboard/categories',
      icon: IconTags,
      isActive: false,
      items: [
        {
          title: 'Add Category',
          url: 'dashboard/add-category'
        },
        {
          title: 'All Categories',
          url: 'dashboard/categories'
        }
      ]
    },
    {
      title: 'Companies',
      url: 'dashboard/companies',
      icon: IconBuildingStore,
      isActive: false,
      items: [
        {
          title: 'Add Company',
          url: 'dashboard/add-company'
        },
        {
          title: 'All Companies',
          url: 'dashboard/companies'
        }
      ]
    },
    {
      title: 'Products',
      url: 'dashboard/products',
      icon: IconPackage,
      isActive: false,
      items: [
        {
          title: 'Add Products',
          url: 'dashboard/add-product'
        },
        {
          title: 'All Products',
          url: 'dashboard/products'
        }
      ]
    },
    {
      title: 'Sales',
      url: 'dashboard/sales',
      icon: IconReceipt2,
      isActive: false
    }
    // {
    //   title: "Settings",
    //   url: "dashboard/settings",
    //   icon: Settings,
    //   isActive: false,
    // },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): JSX.Element {
  const session = { data: { user: { name: 'admin', email: 'admin@example.com' } } }

  const user = {
    name: session.data?.user.name || 'admin',
    email: session.data?.user.email || '',
    avatar: <IconUser className="h-4 w-4" />
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="dashboard">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
                  <IconBook2 className="h-5 w-5" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight">Books Compass</span>
                  <span className="text-[11px] text-muted-foreground">Inventory Studio</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dashboardNavigations.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
