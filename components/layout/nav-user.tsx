'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  Loader2Icon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { authClient } from '@/lib/auth/auth-client';

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session } = authClient.useSession();

  const user = session?.user;

  if (!user) {
    return null;
  }

  const initials = user.name
    ?.split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authClient.signOut();

      router.replace('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='aria-expanded:bg-muted'
              />
            }
          >
            <Avatar>
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name}
              />

              <AvatarFallback>
                {initials || user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>
                {user.name}
              </span>

              <span className='text-muted-foreground truncate text-xs'>
                {user.email}
              </span>
            </div>

            <ChevronsUpDownIcon className='ml-auto size-4' />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar>
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />

                    <AvatarFallback>
                      {initials || user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {user.name}
                    </span>

                    <span className='text-muted-foreground truncate text-xs'>
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push('/account')}
              >
                <BadgeCheckIcon />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push('/billing')}
              >
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push('/notifications')}
              >
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className='text-destructive focus:text-destructive'
            >
              {isLoggingOut ? (
                <Loader2Icon className='animate-spin' />
              ) : (
                <LogOutIcon />
              )}

              {isLoggingOut ? 'Logging out...' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
