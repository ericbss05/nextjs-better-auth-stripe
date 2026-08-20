import { Header } from './_components/header';

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <>
    <Header />
        <main className='flex flex-1 flex-col'>
          {children}
        </main>
    </>
  );
}