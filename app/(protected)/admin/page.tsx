

export default async function AdminPage() {






  return (
    <div className='mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 p-6 md:p-10'>
      {/* Welcome Banner */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
          Welcome back, 
        </h1>
        <p className='text-muted-foreground'>
          Here&apos;s what&apos;s happening with your projects today.
        </p>

      </div>
    </div>
  );
}