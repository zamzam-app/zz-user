'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth/context/AuthContext';

const googleMapsLink = 'https://www.google.com/maps/place/ZamZam'; // temporary static link

export function SuccessStep({
  rating = 0,
  isComplaint = false,
}: {
  rating?: number;
  isComplaint?: boolean;
}) {
  const { clearSession } = useAuth();
  const isHighRating = !isComplaint && rating >= 4;
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

  if (isComplaint) {
    return (
      <div className='pb-24 pt-4'>
        <header className='relative flex items-center justify-center px-6 py-4'>
          <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
            Complaint Received
          </h1>
        </header>

        <div className='px-6 mb-8 pt-2 flex flex-col items-center gap-4'>
          <div className='w-16 h-16 rounded-full bg-[#F1F5F3] flex items-center justify-center'>
            <ShieldCheck size={36} className='text-[#3DCA84]' />
          </div>
          <h1 className="font-['Epilogue']! font-bold text-[28px] tracking-tight text-gray-900 text-center">
            We&apos;ve received your complaint.
          </h1>
        </div>

        <p className='font-[Epilogue]! tracking-tighter mb-8 max-w-xs mx-auto w-full text-center text-gray-600'>
          Our team will review it and get back to you shortly. Thank you for
          helping us improve.
        </p>
      </div>
    );
  }

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
    </div>
  );
}
