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
        <>
            <main className='flex flex-1 flex-col'>
                {children}
            </main>
        </>
    );
}