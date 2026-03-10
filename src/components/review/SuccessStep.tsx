'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth/context/AuthContext';

const googleMapsLink = 'https://www.google.com/maps/place/ZamZam'; // temporary static link

export function SuccessStep({ rating = 0 }: { rating?: number }) {
  const { clearSession } = useAuth();
  const isHighRating = rating >= 4;
  const firedRef = useRef(false);

  useEffect(() => {
    clearSession();
  }, [clearSession]);

  useEffect(() => {
    if (isHighRating && !firedRef.current) {
      firedRef.current = true;
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFF5CC', '#FFCC00'],
      });
    }
  }, [isHighRating]);

  return (
    <div className='pb-24 pt-4'>
      <header className='relative flex items-center justify-center px-6 py-4'>
        <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
          Feedback Submitted
        </h1>
      </header>

      <div className='px-6 mb-8 pt-2'>
        <h1 className="font-['Epilogue']! font-bold text-[32px] tracking-tight text-gray-900 text-center">
          Thank you for your feedback!
        </h1>
      </div>

      <p className='font-[Epilogue]! tracking-tighter mb-8 max-w-xs mx-auto w-full text-center'>
        Your valuable input helps us enhance your experience at ZamZam.
      </p>

      {/* GOOGLE BUTTON ONLY IF RATING >= 4 */}
      {isHighRating && (
        <div className='flex justify-center mb-8 animate-bounce'>
          <a
            href={googleMapsLink}
            target='_blank'
            rel='noopener noreferrer'
            className='px-6 py-3 rounded-full font-bold text-black shadow-lg transition-all duration-300 hover:scale-105'
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFB800)',
            }}
          >
            Rate us on Google
          </a>
        </div>
      )}

      <div className='w-full max-w-sm mx-auto rounded-2xl overflow-hidden mb-8 shadow-xl border border-gray-100'>
        <div className='bg-gray-100 h-48 w-full flex flex-col items-center justify-center text-gray-400'>
          <div className='text-3xl mb-2'>📸</div>
          <span className="font-['Epilogue'] font-medium">
            Restaurant Image
          </span>
        </div>
      </div>
    </div>
  );
}
