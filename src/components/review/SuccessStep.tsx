'use client';

export function SuccessStep() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-6 text-center'>
      <div className='w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce'>
        <svg
          className='w-10 h-10 text-emerald-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Thank You!</h1>
      <p className='text-gray-500 text-lg mb-8 max-w-xs mx-auto'>
        Your feedback helps us improve our service at ZamZam.
      </p>
      <div className='w-full max-w-sm rounded-2xl overflow-hidden mb-8 shadow-xl border border-gray-100'>
        {/* Placeholder image */}
        <div className='bg-gray-200 h-48 w-full flex items-center justify-center text-gray-400'>
          Restaurant Image
        </div>
      </div>
    </div>
  );
}
