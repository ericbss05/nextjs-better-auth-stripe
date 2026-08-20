import { LoginForm } from '@/app/(auth)/_components/forms/login-form';
import Link from 'next/link';

export default async function LoginPage() {

  return (
    <div className='bg-background relative flex min-h-screen w-full flex-col overflow-x-hidden'>
      <div className='flex h-full grow flex-col gap-4 items-center justify-center p-4'>
        <LoginForm />
         <p className='text-muted-foreground px-8 text-center text-sm'>
        Don&apos;t have an account?{' '}

        <Link
          href='/signup'
          className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'
        >
          Sign up
        </Link>
      </p>
      </div>
    </div>
  );
}