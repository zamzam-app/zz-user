

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-white'>
    
      <main className='pt-26 md:pt-40 px-3 md:px-8 max-w-[1664px] mx-auto w-full'>
        {children}
      </main>

    </div>
  );
}
