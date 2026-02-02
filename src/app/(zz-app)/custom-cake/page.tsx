import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function CustomCakePage() {
  return (
    <div className='min-h-screen bg-[#FAFAFA] px-4 pt-6 pb-32 relative'>
      
      {/* Header */}
      <div className='relative flex items-center justify-center mb-4'>
        <Link href='/cake-library' className='absolute left-0'>
          <ArrowLeftOutlined className='text-xl text-gray-800 hover:text-[#751414] transition-colors' />
        </Link>
        <h1
          className="
          font-['Epilogue'] font-extrabold tracking-tight text-gray-900
          text-base sm:text-xl md:text-2xl lg:text-3xl
          truncate max-w-[70%] text-center translate-y-1 md:translate-y-2
        "
        >Custom Cake</h1>
      </div>

      {/* Description */}
      <p className='text-sm text-center text-gray-600 mb-6 leading-relaxed'>
        Upload a photo of your dream cake and tell us about your customization
        requests. We’ll get back to you with a quote.
      </p>

      {/* Upload box */}
      <div className='border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white mb-5'>
        <p className='font-semibold text-gray-900 mb-2'>Upload Image</p>

        <p className='text-sm text-gray-500 mb-4'>
          Tap to upload an image of your cake design
        </p>

        <button className='bg-[#7A2D2A] text-white! px-6 py-2 rounded-lg font-semibold active:scale-95 transition'>
          Upload
        </button>
      </div>

      {/* Textarea */}
      <textarea
        placeholder=' Tell us how you want this to be'
        className='w-full p-8 rounded-xl bg-[#FFF9F0] text-sm text-gray-900 border-2 border-gray-300'
        rows={4}
      />

      {/* Bottom fixed button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 '>
        <button className="w-full bg-[#923a3a] text-white! py-4 rounded-2xl font-['Epilogue'] font-bold text-lg active:scale-[0.98] transition-transform shadow-md">
          Get Quote
        </button>
      </div>
    </div>
  );
}
