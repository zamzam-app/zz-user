import { useState, useEffect } from 'react';
import { CloseOutlined, StarOutlined } from '@ant-design/icons';
import Image from 'next/image';

interface CakeVisualiserModalProps {
  isOpen: boolean;
  onClose: () => void;
  cakeName: string;
  shape: string;
  flavor: string;
  decorations: string[];
  additionalRequests: string;
  cakeText: string;
  baseImageUrl?: string;
}

export const CakeVisualiserModal = ({
  isOpen,
  onClose,
  cakeName,
  shape,
  flavor,
  decorations,
  additionalRequests,
  cakeText,
  baseImageUrl,
}: CakeVisualiserModalProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);
    setError(null);
    setGeneratedPrompt(null);

    const generateImage = async () => {
      try {
        const res = await fetch('/api/visualise-cake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cakeName,
            shape,
            flavor,
            decorations,
            additionalRequests,
            cakeText,
            baseImageUrl,
          }),
        });

        if (!isMounted) return;

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate image');
        }

        setGeneratedPrompt(data.mockImagePrompt || data.message);
      } catch (err: unknown) {
        if (isMounted)
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred'
          );
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    generateImage();

    return () => {
      isMounted = false;
    };
  }, [
    isOpen,
    cakeName,
    shape,
    flavor,
    decorations,
    additionalRequests,
    cakeText,
    baseImageUrl,
  ]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300'>
      <div className='relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]'>
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-gray-100'>
          <h3 className="font-['Epilogue'] font-bold text-xl text-gray-900 flex items-center gap-2">
            <StarOutlined className='text-[#923a3a]' />
            Visualise Your Cake
          </h3>
          <button
            onClick={onClose}
            className='p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors'
          >
            <CloseOutlined />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto w-full'>
          <div className='space-y-6'>
            {/* Visualisation Area */}
            <div className='relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#fdfcfb] to-[#f4ebeb] border-2 border-dashed border-[#e8edf2] flex items-center justify-center shadow-inner'>
              {isGenerating ? (
                <div className='flex flex-col items-center justify-center text-center p-6'>
                  <div className='w-16 h-16 border-4 border-[#923a3a]/20 border-t-[#923a3a] rounded-full animate-spin mb-4' />
                  <p className="font-['Epilogue'] font-semibold text-gray-700 text-lg">
                    Generating Magic...
                  </p>
                  <p className='text-sm text-gray-500 mt-2 max-w-[200px]'>
                    Our AI is baking your custom visualization
                  </p>
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center text-center p-6 h-full w-full'>
                  {baseImageUrl ? (
                    <Image
                      src={baseImageUrl}
                      alt='Generated Cake'
                      fill
                      className='object-cover opacity-30 mix-blend-multiply transition-opacity duration-1000'
                    />
                  ) : null}
                  <div className='z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white max-w-sm max-h-full overflow-y-auto'>
                    {error ? (
                      <>
                        <StarOutlined className='text-4xl text-[#923a3a] mb-3 inline-block' />
                        {error.toLowerCase().includes('429') ||
                        error.toLowerCase().includes('quota') ? (
                          <>
                            <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                              AI is taking a break
                            </p>
                            <p className='text-sm text-gray-600 mt-1'>
                              Too many requests! Please wait a minute and try
                              again.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                              Visualisation Ready!
                            </p>
                            <p className='text-sm text-gray-600 mt-1'>
                              (AI Image implementation coming soon)
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <StarOutlined className='text-4xl text-[#923a3a] mb-3 inline-block' />
                        <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                          Visualisation Prompt Ready!
                        </p>
                        {generatedPrompt && (
                          <div className='mt-3 p-3 bg-gray-50 rounded-xl text-left'>
                            <p className='text-xs text-gray-600 whitespace-pre-wrap leading-relaxed'>
                              {generatedPrompt}
                            </p>
                          </div>
                        )}
                        <p className='text-xs text-[#923a3a] mt-3 font-medium'>
                          *Powered by ZamZam AI (Nano Banana)*
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cake Details Summary */}
            <div className='bg-[#fafafa] rounded-2xl p-5 border border-gray-100'>
              <h4 className="font-['Epilogue'] font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                Your Custom Recipe
              </h4>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-start'>
                  <span className='w-24 text-gray-500 flex-none'>
                    Base Cake:
                  </span>
                  <span className='font-medium text-gray-900'>{cakeName}</span>
                </li>
                {shape && (
                  <li className='flex items-start'>
                    <span className='w-24 text-gray-500 flex-none'>Shape:</span>
                    <span className='font-medium text-gray-900'>{shape}</span>
                  </li>
                )}
                {flavor && (
                  <li className='flex items-start'>
                    <span className='w-24 text-gray-500 flex-none'>
                      Flavor:
                    </span>
                    <span className='font-medium text-gray-900'>{flavor}</span>
                  </li>
                )}
                {decorations.length > 0 && (
                  <li className='flex items-start'>
                    <span className='w-24 text-gray-500 flex-none'>
                      Decorations:
                    </span>
                    <span className='font-medium text-gray-900'>
                      {decorations.join(', ')}
                    </span>
                  </li>
                )}
                {cakeText && (
                  <li className='flex items-start'>
                    <span className='w-24 text-gray-500 flex-none'>
                      Cake Text:
                    </span>
                    <span className='font-medium text-gray-900'>
                      &quot;{cakeText}&quot;
                    </span>
                  </li>
                )}
                {additionalRequests && (
                  <li className='flex flex-col mt-2 pt-2 border-t border-gray-200'>
                    <span className='text-gray-500 mb-1'>
                      Special Requests:
                    </span>
                    <span className='font-medium text-gray-900 italic'>
                      {additionalRequests}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
