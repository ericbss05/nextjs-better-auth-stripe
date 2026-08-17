'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LayoutDashboardIcon,
  SettingsIcon,
  LifeBuoyIcon,
  TerminalIcon,
  UsersIcon,
  PlugIcon,
  CreditCardIcon,
  BookOpenIcon,
} from 'lucide-react';

import { NavMain } from '@/components/layout/nav-main';
import { NavSecondary } from '@/components/layout/nav-secondary';
import { NavUser } from '@/components/layout/nav-user';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: 'Leads',
      url: '/leads',
      icon: <UsersIcon />,
    },
    {
      title: 'Integrations',
      url: '/integrations',
      icon: <PlugIcon />,
    },
    {
      title: 'Billing',
      url: '/billing',
      icon: <CreditCardIcon />,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: <SettingsIcon />,
    },
  ],

  navSecondary: [
    {
      title: 'Documentation',
      url: '/documentation',
      icon: <BookOpenIcon />,
    },
    {
      title: 'Support',
      url: '/support',
      icon: <LifeBuoyIcon />,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export function AppSidebar({
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon' variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href='/dashboard'>
              <SidebarMenuButton size='lg'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <TerminalIcon className='size-4' />
                </div>

                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    My App
                  </span>

                  <span className='truncate text-xs text-muted-foreground'>
                    Dashboard
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary
          items={data.navSecondary}
          className='mt-auto'
        />
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}