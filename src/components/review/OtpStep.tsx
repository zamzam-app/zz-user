'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

export type OtpStepProps = {
  open: boolean;
  onClose: () => void;
  otp: string;
  onOtpChange: (value: string) => void;
  phoneNumber: string;
  onVerify: () => void;
  onResend: () => void;
  verifyLoading: boolean;
  resendLoading: boolean;
};

export function OtpStep({
  open,
  onClose,
  otp,
  onOtpChange,
  phoneNumber,
  onVerify,
  onResend,
  verifyLoading,
  resendLoading,
}: OtpStepProps) {
  const actionsDisabled = verifyLoading || resendLoading;

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[1100] flex flex-col justify-end bg-black/45 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      onClick={onClose}
    >
      <div
        className='relative w-full rounded-t-[28px] bg-white px-5 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          disabled={actionsDisabled}
          aria-label='Close verification'
          className='absolute right-5 top-4 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <CloseOutlined />
        </button>
        <div className='text-center'>
          <h2 className='font-[Epilogue]! text-lg font-bold text-gray-800 mb-0.5'>
            Verification
          </h2>
          <p className='font-[Epilogue]! text-gray-500 text-sm mb-3'>
            Enter the 6-digit code sent to +91 {phoneNumber}
          </p>
          <div className='otp-input-group flex justify-center mb-4'>
            <Input.OTP
              length={6}
              value={otp}
              onChange={onOtpChange}
              size='large'
              disabled={actionsDisabled}
            />
          </div>
          <Button
            type='primary'
            block
            size='large'
            onClick={onVerify}
            loading={verifyLoading}
            disabled={resendLoading || otp.length !== 6}
            className='font-[Epilogue]! font-medium bg-[#923a3a]! hover:bg-[#7d2f2f]! text-white! h-11 text-base mb-2 border-none!'
          >
            Verify
          </Button>
          <Button
            type='link'
            onClick={onResend}
            loading={resendLoading}
            disabled={actionsDisabled}
            className='font-[Epilogue]! text-[#923a3a]! hover:text-[#7d2f2f]! text-sm'
          >
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  );
}
