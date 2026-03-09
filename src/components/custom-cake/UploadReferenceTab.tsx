import Image from 'next/image';
import { DeleteOutlined } from '@ant-design/icons';
import Button from '@/components/common/Button';
import { RefObject } from 'react';

interface UploadReferenceTabProps {
  uploadedImageUrl: string | null;
  onUploadedImageChange: (url: string | null) => void;
  uploadNotes: string;
  onUploadNotesChange: (notes: string) => void;
  uploadInputRef: RefObject<HTMLInputElement | null>;
  uploadLoading: boolean;
  uploadError: { message: string } | null;
  onUploadClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGetQuote: () => void;
}

export const UploadReferenceTab = ({
  uploadedImageUrl,
  onUploadedImageChange,
  uploadNotes,
  onUploadNotesChange,
  uploadInputRef,
  uploadLoading,
  uploadError,
  onUploadClick,
  onFileChange,
  onGetQuote,
}: UploadReferenceTabProps) => {
  return (
    <div className='min-h-screen bg-[#FAFAFA] px-4 pt-6 '>
      {/* Description */}
      <p className='text-sm text-center text-gray-600 mb-6 leading-relaxed'>
        Upload a photo of your dream cake and tell us about your customization
        requests. We’ll get back to you with a quote.
      </p>

      {/* Upload box */}
      <input
        ref={uploadInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onFileChange}
      />
      <div className='border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white mb-5'>
        {uploadedImageUrl ? (
          <div className='relative w-full max-w-xs mx-auto aspect-square rounded-lg overflow-hidden bg-gray-100'>
            <Image
              src={uploadedImageUrl}
              alt='Your cake reference'
              fill
              className='object-contain'
              sizes='(max-width: 320px) 280px, 320px'
            />
            <button
              type='button'
              onClick={() => onUploadedImageChange(null)}
              className='absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md z-10'
              aria-label='Remove image'
            >
              <DeleteOutlined className='text-lg' />
            </button>
          </div>
        ) : (
          <>
            <p className='font-semibold text-gray-900 mb-2'>Upload Image</p>
            <p className='text-sm text-gray-500 mb-4'>
              Tap to upload an image of your cake design
            </p>
            <Button onClick={onUploadClick} disabled={uploadLoading}>
              {uploadLoading ? 'Uploading…' : 'Upload'}
            </Button>
          </>
        )}
        {uploadError && (
          <p className='mt-3 text-sm text-red-600'>{uploadError.message}</p>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={uploadNotes}
        onChange={(e) => onUploadNotesChange(e.target.value)}
        placeholder=' Tell us how you want this to be'
        className='w-full p-8 rounded-xl bg-[#FFF9F0] text-sm text-gray-900 border-2 border-gray-300'
        rows={4}
      />
      {/* Bottom fixed button */}
      <div className='fixed bottom-0 left-0 right-0 p-6 z-50'>
        <Button fullWidth onClick={onGetQuote}>
          Get Quote
        </Button>
      </div>
    </div>
  );
};
