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
  ArrowUp,
  Box,
  Building2,
  Layers2,
  LayoutDashboard,
  ListChecksIcon,
  NotepadTextIcon,
  User,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'

const dashboardNavigations = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true
    },

    {
      title: 'Categories',
      url: '/dashboard/categories',
      icon: Layers2,
      isActive: false,
      items: [
        {
          title: 'Add Category',
          url: '/dashboard/add-category'
        },
        {
          title: 'All Categories',
          url: '/dashboard/categories'
        }
      ]
    },
    {
      title: 'Companies',
      url: '/dashboard/companies',
      icon: Building2,
      isActive: false,
      items: [
        {
          title: 'Add Company',
          url: '/dashboard/add-company'
        },
        {
          title: 'All Companies',
          url: '/dashboard/companies'
        }
      ]
    },
    {
      title: 'Products',
      url: '/dashboard/products',
      icon: ListChecksIcon,
      isActive: false,
      items: [
        {
          title: 'Add Products',
          url: '/dashboard/add-product'
        },
        {
          title: 'All Products',
          url: '/dashboard/products'
        }
      ]
    },
    {
      title: 'Orders',
      url: '/dashboard/orders',
      icon: Box,
      isActive: false
    },
    {
      title: 'Users',
      url: '/dashboard/users',
      icon: Users,
      isActive: false
    },
    {
      title: 'Queries',
      url: '/dashboard/queries',
      icon: NotepadTextIcon,
      isActive: false
    }
    // {
    //   title: "Settings",
    //   url: "/dashboard/settings",
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
    avatar: <User />
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/dashboard">
                <ArrowUp className="size-5!" />
                <span className="text-base font-semibold">Books Store.</span>
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
