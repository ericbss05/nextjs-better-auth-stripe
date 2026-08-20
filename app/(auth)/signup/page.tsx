import { SignupForm } from '@/app/(auth)/_components/forms/signup-form';
import Link from 'next/link';

export default async function SignUpPage() {

  return (
    <div className='bg-background relative flex min-h-screen w-full flex-col overflow-x-hidden'>
      <div className='flex h-full grow flex-col gap-4 items-center justify-center p-4'>
        <SignupForm />
        {/* Footer Sign In */}
      <p className='text-muted-foreground px-8 text-center text-sm'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline'
        >
          Sign in
        </Link>
      </p>

      {/* Terms */}
      <p className='text-muted-foreground px-8 text-center text-xs'>
        By clicking continue, you agree to our{' '}
        <Link
          href='#'
          className='hover:text-primary underline underline-offset-4'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='#'
          className='hover:text-primary underline underline-offset-4'
        >
          Privacy Policy
        </Link>
        .
      </p>
      </div>
    </div>
  );
}