'use client';

import { useState, useCallback } from 'react';
import { Input, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { DateWheelPicker } from '@/components/common/DateWheelPicker';

interface CakeUserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const;

function isValidPastDate(d: Dayjs | null): boolean {
  if (!d || !d.isValid()) return false;
  const today = dayjs().startOf('day');
  return d.isBefore(today);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

export const CakeUserDetailsModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CakeUserDetailsModalProps) => {
  const [number, setNumber] = useState('');
  const [dob, setDob] = useState<Dayjs | null>(null);
  const [gender, setGender] = useState<string>('');

  const validate = useCallback((): boolean => {
    if (!number.trim()) {
      message.error('Phone number is required');
      return false;
    }
    if (!isValidPhone(number)) {
      message.error('Enter a valid 10-digit mobile number');
      return false;
    }
    if (!dob?.isValid()) {
      message.error('Please select a valid date of birth');
      return false;
    }
    if (!isValidPastDate(dob)) {
      message.error('Please enter a valid past date');
      return false;
    }
    return true;
  }, [number, dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onConfirm();
  };

  const handleClose = () => {
    setNumber('');
    setDob(null);
    setGender('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300'
      role='dialog'
      aria-modal='true'
      onClick={handleClose}
    >
      <div
        className='relative w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[70vh] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='shrink-0 pt-3 pb-2 px-5'>
          <div
            className='mx-auto w-10 h-1 rounded-full bg-gray-300'
            aria-hidden
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-5 overflow-y-auto flex-1 min-h-0'
        >
          <div className='space-y-2'>
            <label
              htmlFor='cake-user-number'
              className="block font-['Epilogue'] font-bold text-[#0D141C]"
            >
              Phone number <span className='text-red-500'>*</span>
            </label>
            <Input
              id='cake-user-number'
              type='tel'
              inputMode='numeric'
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder='10-digit mobile number'
              maxLength={14}
              size='large'
              className="font-['Epilogue'] rounded-xl"
            />
          </div>

          <div className='space-y-2'>
            <label
              htmlFor='cake-user-dob'
              className="block font-['Epilogue'] font-bold text-[#0D141C]"
            >
              Date of birth <span className='text-red-500'>*</span>
            </label>
            <DateWheelPicker
              key={dob ? String(dob.valueOf()) : 'empty'}
              id='cake-user-dob'
              value={dob}
              onChange={(date) => setDob(date)}
            />
          </div>

          <div className='space-y-2'>
            <span className="block font-['Epilogue'] font-bold text-[#0D141C]">
              Gender{' '}
              <span className='text-gray-400 font-normal'>(optional)</span>
            </span>
            <div className='flex flex-wrap gap-3'>
              {GENDER_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className='flex items-center gap-2 cursor-pointer'
                >
                  <input
                    type='radio'
                    name='cake-user-gender'
                    value={opt.value}
                    checked={gender === opt.value}
                    onChange={() => setGender(opt.value)}
                    className='w-4 h-4 accent-[#923a3a]'
                  />
                  <span className="font-['Epilogue'] text-sm text-[#0D141C]">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              className="w-full py-4 rounded-2xl font-['Epilogue'] font-bold text-lg transition-transform shadow-md bg-[linear-gradient(135deg,#923a3a_0%,#6d2020_100%)] text-white! active:scale-[0.98]"
            >
              Continue to Visualise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
