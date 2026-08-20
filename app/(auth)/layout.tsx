import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/server/user';

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {

      const session = await isAuthenticated();
    
      if (session) {
        redirect('/dashboard');
      }

  return (
    <>
        <main className='flex flex-1 flex-col'>
          {children}
        </main>
    </>
  );
}