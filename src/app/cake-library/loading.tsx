'use client';

export default function Loading() {
  return (
    <div className='bg-white min-h-screen pb-28'>
      <header className='relative flex items-center justify-center px-6 pt-12 pb-4'>
        <div className='h-6 w-40 rounded-lg shimmer' />
      </header>

      <div className='flex gap-3 px-6 py-4 overflow-x-auto no-scrollbar'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='h-9 w-20 rounded-xl shimmer' />
        ))}
      </div>

      <div className='grid grid-cols-2 gap-4 px-6 mt-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='flex flex-col gap-2'>
            <div className='aspect-4/5 rounded-4xl shimmer' />
            <div className='h-4 w-3/4 rounded shimmer' />
            <div className='h-4 w-1/2 rounded shimmer' />
          </div>
        ))}
      </div>

      <div className='fixed bottom-0 left-0 right-0 p-6 z-50'>
        <div className='h-12 w-full rounded-2xl shimmer' />
      </div>
    </div>
  );
}
