import { VerifyEmailForm } from '@/app/(auth)/_components/forms/verify-email-form';

export default async function VerifyEmailPage() {
    
  return (
    <div className='bg-background relative flex min-h-screen w-full flex-col overflow-x-hidden'>
      <div className='flex h-full grow flex-col items-center justify-center p-4'>
        <VerifyEmailForm />
      </div>
    </div>
  );
}