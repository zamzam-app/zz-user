'use client';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';

export function SuccessStep() {
  return (
    <div className='pb-24 pt-4'>
      {/* Header */}
      <header className='relative flex items-center justify-center px-6 py-4'>
        <Link href='/' className='absolute left-6'>
          <ArrowLeftOutlined className='text-xl text-black! ' />
        </Link>

        <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
          Feedback Submitted
        </h1>
      </header>
      <div className='px-6 mb-8 pt-2'>
        <h1 className="font-['Epilogue']! font-bold text-[32px] tracking-tight text-gray-900 text-center">
          Thank you for your feedback!
        </h1>
      </div>
      {/* <div className='w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce'>
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
      </div> */}

      <p className='font-[Epilogue]! tracking-tighter mb-8 max-w-xs mx-auto w-full text-center'>
        Your valuable input helps us enhance your experience at ZamZam.
      </p>
      <div className='w-full max-w-sm mx-auto rounded-2xl overflow-hidden mb-8 shadow-xl border border-gray-100'>
        {/* Placeholder image */}
        <div className='bg-gray-100 h-48 w-full flex flex-col items-center justify-center text-gray-400'>
          {/* Optional: Add an icon */}
          <div className='text-3xl mb-2'>📸</div>
          <span className="font-['Epilogue'] font-medium">
            Restaurant Image
          </span>
        </div>
      </div>
    </div>
  );
}
