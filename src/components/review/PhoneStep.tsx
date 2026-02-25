'use client';

import { Button, Input } from 'antd';

export type PhoneStepProps = {
  phoneNumber: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

export function PhoneStep({
  phoneNumber,
  onPhoneChange,
  onSubmit,
  loading,
}: PhoneStepProps) {
  return (
    <div className='flex flex-col h-full justify-center px-6'>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Welcome</h1>
        <p className='text-gray-500'>
          Please enter your mobile number to continue
        </p>
      </div>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Mobile Number
          </label>
          <Input
            size='large'
            prefix={<span className='text-gray-400'>+91</span>}
            placeholder='Enter your number'
            value={phoneNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 10) onPhoneChange(val);
            }}
            maxLength={10}
            className='w-full'
          />
        </div>
        <Button
          type='primary'
          block
          size='large'
          onClick={onSubmit}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium'
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
}
