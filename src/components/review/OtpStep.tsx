'use client';

import { Button, Input } from 'antd';
import { ChevronLeft } from 'lucide-react';

export type OtpStepProps = {
  otp: string;
  onOtpChange: (value: string) => void;
  phoneNumber: string;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  loading: boolean;
};

export function OtpStep({
  otp,
  onOtpChange,
  phoneNumber,
  onVerify,
  onResend,
  onBack,
  loading,
}: OtpStepProps) {
  return (
    <div className='flex flex-col h-full justify-center px-6'>
      <Button
        type='text'
        icon={<ChevronLeft />}
        className='absolute top-4 left-4'
        onClick={onBack}
      >
        Back
      </Button>
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Verification</h1>
        <p className='text-gray-500'>
          Enter the 4-digit code sent to +91 {phoneNumber}
        </p>
      </div>
      <div className='space-y-6'>
        <div className='flex justify-center'>
          <Input.OTP
            length={4}
            value={otp}
            onChange={onOtpChange}
            size='large'
          />
        </div>
        <Button
          type='primary'
          block
          size='large'
          onClick={onVerify}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium'
        >
          Verify
        </Button>
        <div className='text-center'>
          <Button
            type='link'
            onClick={onResend}
            disabled={loading}
            className='text-emerald-600'
          >
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  );
}
