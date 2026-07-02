import { useEffect } from 'react';
import Image from 'next/image';
import { CloseOutlined } from '@ant-design/icons';
import { Product } from '@/types/product';

interface CakeDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cake: Product | null;
  onAddClick: () => void;
  priceLabel: string;
}

export function CakeDetailSheet({
  isOpen,
  onClose,
  cake,
  onAddClick,
  priceLabel,
}: CakeDetailSheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !cake) return null;

  const imageUrl = cake.images?.[0];

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300'
      role='dialog'
      aria-modal='true'
      onClick={onClose}
    >
      <div
        className='relative w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='shrink-0 pt-3 pb-2 px-5 relative flex justify-center'>
          <div className='w-10 h-1 rounded-full bg-gray-300' aria-hidden />
          <button
            onClick={onClose}
            aria-label='Close details'
            className='absolute right-5 top-2 p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors'
          >
            <CloseOutlined />
          </button>
        </div>

        <div className='p-6 overflow-y-auto flex-1 min-h-0 space-y-6'>
          {imageUrl && (
            <div className='relative w-full aspect-16/10 rounded-2xl overflow-hidden shadow-sm'>
              <Image
                src={imageUrl}
                alt={cake.name}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          )}

          <div>
            <div className='flex justify-between items-start gap-4'>
              <h2 className="font-['Epilogue'] font-bold text-2xl text-[#0D141C]">
                {cake.name}
              </h2>
              <p className="font-['Epilogue'] text-[#923a3a] font-bold text-lg whitespace-nowrap">
                {priceLabel}
              </p>
            </div>
            {cake.description && (
              <p className='text-base text-gray-600 mt-2 leading-relaxed'>
                {cake.description}
              </p>
            )}
          </div>
        </div>

        <div className='shrink-0 border-t border-gray-100 bg-white p-6'>
          <button
            onClick={() => {
              onClose();
              onAddClick();
            }}
            className="w-full py-4 rounded-2xl font-['Epilogue'] font-bold text-lg transition-transform shadow-md bg-[linear-gradient(135deg,#923a3a_0%,#6d2020_100%)] text-white! active:scale-[0.98]"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
