import { useState, useEffect, useCallback } from 'react';
import {
  CloseOutlined,
  DownloadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { useImageUpload } from '@/lib/hooks/useImageUpload';

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
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/png');
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const [placeholderImageUrl, setPlaceholderImageUrl] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuoting, setIsQuoting] = useState(false);

  const { upload } = useImageUpload('cake-visualiser');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setImageBase64(null);
    setFallbackText(null);
    setPlaceholderImageUrl(null);

    try {
      const res = await fetch('/api/visualise-cake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cakeName,
          shape,
          flavor,
          decorations,
          cakeText,
          extraRequests: additionalRequests,
          baseImageUrl: baseImageUrl ?? null,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Something went wrong');
        if (data.placeholderImage)
          setPlaceholderImageUrl(data.placeholderImage);
        return;
      }

      if (data.imageBase64) {
        setImageBase64(data.imageBase64);
        setImageMime(data.mimeType || 'image/png');
        setFallbackText(null);
      } else {
        setFallbackText(data.message);
      }
    } catch (err: unknown) {
      setError('Failed to generate cake preview. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    cakeName,
    shape,
    flavor,
    decorations,
    additionalRequests,
    cakeText,
    baseImageUrl,
  ]);

  useEffect(() => {
    if (!isOpen) return;
    handleGenerate();
  }, [isOpen, handleGenerate]);

  const handleDownloadImage = () => {
    if (!imageBase64) return;
    try {
      const binary = atob(imageBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: imageMime || 'image/png' });
      const url = URL.createObjectURL(blob);
      const ext = imageMime.includes('png')
        ? 'png'
        : imageMime.includes('jpeg') || imageMime.includes('jpg')
          ? 'jpg'
          : 'png';
      const a = document.createElement('a');
      a.href = url;
      a.download = `zamzam-cake-preview.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  const handleGetQuote = async () => {
    if (!imageBase64 || isQuoting) return;
    setIsQuoting(true);
    setError(null);

    try {
      const binary = atob(imageBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const mime = imageMime || 'image/png';
      const ext = mime.includes('png')
        ? 'png'
        : mime.includes('jpeg') || mime.includes('jpg')
          ? 'jpg'
          : 'png';
      const blob = new Blob([bytes], { type: mime });
      const file = new File([blob], `zamzam-cake-preview.${ext}`, {
        type: mime,
      });

      const uploadedUrl = await upload(file);

      const message =
        `Hi! I would like to order a Cake.\n\n` +
        `*Cake Details:*\n` +
        `• Name: ${cakeName}\n` +
        `• Cake Text: ${cakeText.trim() || 'None'}\n` +
        `• Shape: ${shape ? shape.charAt(0).toUpperCase() + shape.slice(1) : 'None'}\n` +
        `• Flavour: ${flavor.trim() || 'None'}\n` +
        `• Decorations: ${decorations.join(', ') || 'None'}\n` +
        `• Additional requests: ${additionalRequests.trim() || 'None'}\n\n` +
        `Generated preview: ${uploadedUrl}\n` +
        (baseImageUrl ? `Reference image: ${baseImageUrl}\n` : '');

      const whatsappUrl = `https://wa.me/917204094741?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.error(e);
      setError('Failed to generate quote link. Please try again.');
    } finally {
      setIsQuoting(false);
    }
  };

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
        <div className='p-6 overflow-y-auto w-full flex-1 min-h-0'>
          <div className='space-y-6'>
            {/* Visualisation Area */}
            <div className='relative w-full aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-[#fdfcfb] to-[#f4ebeb] border-2 border-dashed border-[#e8edf2] flex items-center justify-center shadow-inner'>
              {isLoading && (
                <div className='flex flex-col items-center justify-center py-12'>
                  <div className='w-16 h-16 border-4 border-[#923a3a]/20 border-t-[#923a3a] rounded-full animate-spin mb-4' />
                  <p className="font-['Epilogue'] font-semibold text-gray-700 text-lg">
                    Generating your cake preview…
                  </p>
                  <p className='text-sm text-gray-500 mt-2 max-w-[200px]'>
                    Our AI is baking your custom visualization
                  </p>
                </div>
              )}

              {error && !isLoading && (
                <div className='flex flex-col items-center justify-center text-center p-6'>
                  <StarOutlined className='text-4xl text-[#923a3a] mb-3 inline-block' />
                  {error.toLowerCase().includes('429') ||
                  error.toLowerCase().includes('quota') ? (
                    <>
                      <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                        AI is taking a break
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>
                        Too many requests! Please wait a minute and try again.
                      </p>
                    </>
                  ) : (
                    <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                      {error}
                    </p>
                  )}
                  {placeholderImageUrl && (
                    <div className='mt-4 w-full max-w-sm rounded-2xl overflow-hidden shadow-lg'>
                      <Image
                        src={placeholderImageUrl}
                        alt='Cake placeholder'
                        width={400}
                        height={400}
                        className='w-full h-auto object-cover'
                      />
                    </div>
                  )}
                </div>
              )}

              {imageBase64 && !isLoading && (
                <div className='flex flex-col items-center gap-3 p-4'>
                  <Image
                    src={`data:${imageMime};base64,${imageBase64}`}
                    alt='Generated cake preview'
                    width={512}
                    height={512}
                    unoptimized
                    className='w-full max-w-sm rounded-2xl shadow-lg object-cover'
                  />
                  <p className='text-xs text-[#923a3a] font-medium'>
                    *Powered by ZamZam AI (Nano Banana)*
                  </p>
                </div>
              )}

              {fallbackText && !imageBase64 && !isLoading && !error && (
                <div className='z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white max-w-sm max-h-full overflow-y-auto'>
                  <StarOutlined className='text-4xl text-[#923a3a] mb-3 inline-block' />
                  <p className="font-['Epilogue'] font-bold text-[#923a3a] text-lg">
                    Cake Description
                  </p>
                  <p className='mt-3 p-3 bg-gray-50 rounded-xl text-left text-sm text-gray-600 whitespace-pre-wrap'>
                    {fallbackText}
                  </p>
                  <p className='text-xs text-[#923a3a] mt-3 font-medium'>
                    *Powered by ZamZam AI (Nano Banana)*
                  </p>
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

        {imageBase64 && !isLoading && (
          <div className='shrink-0 border-t border-gray-100 bg-white px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]'>
            <div className='flex items-stretch gap-3'>
              <button
                type='button'
                onClick={handleGetQuote}
                disabled={isQuoting}
                className={`flex-1 h-14 px-6 rounded-2xl font-['Epilogue'] font-bold text-lg transition-transform shadow-md flex items-center justify-center ${
                  isQuoting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : 'bg-[linear-gradient(135deg,#923a3a_0%,#6d2020_100%)] text-white! active:scale-[0.98]'
                }`}
              >
                {isQuoting ? (
                  'Preparing…'
                ) : (
                  <>
                    <span className='ml-10'>Get quote</span>
                    <Image
                      src='/zz-logo.png'
                      alt='Zam Zam Logo'
                      width={60}
                      height={60}
                      className='-ml-3 object-contain'
                    />
                  </>
                )}
              </button>

              <button
                type='button'
                onClick={handleDownloadImage}
                aria-label='Download generated image'
                className='w-14 h-14 rounded-2xl border border-[#923a3a] text-[#923a3a] bg-[#fdfcfb] transition-transform shadow-sm flex items-center justify-center active:scale-[0.98]'
              >
                <DownloadOutlined />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
