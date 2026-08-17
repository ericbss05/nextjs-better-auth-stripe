import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { isAuthenticated } from '@/server/user';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await isAuthenticated();

  if (!session) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Header */}
        <header className='flex h-16 shrink-0 items-center'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />

          </div>
        </header>

        {/* Page content */}
        <main className='flex flex-1 flex-col'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}