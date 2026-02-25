'use client';

import { Button, Input, Modal } from 'antd';

export type OtpStepProps = {
  open: boolean;
  onClose: () => void;
  otp: string;
  onOtpChange: (value: string) => void;
  phoneNumber: string;
  onVerify: () => void;
  onResend: () => void;
  loading: boolean;
};

export function OtpStep({
  open,
  onClose,
  otp,
  onOtpChange,
  phoneNumber,
  onVerify,
  onResend,
  loading,
}: OtpStepProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable
      centered={false}
      width='100%'
      wrapClassName='otp-modal-wrap-bottom'
      className='otp-modal-no-scroll'
      styles={{
        wrapper: {
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        container: {
          margin: 0,
          marginBottom: 24,
          maxWidth: '100%',
          overflow: 'hidden',
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        },
        body: { padding: '16px 20px 24px', overflow: 'hidden' },
      }}
    >
      <div className='text-center'>
        <h2 className='text-lg font-bold text-gray-800 mb-0.5'>Verification</h2>
        <p className='text-gray-500 text-sm mb-3'>
          Enter the 6-digit code sent to +91 {phoneNumber}
        </p>
        <div className='flex justify-center mb-4'>
          <Input.OTP
            length={6}
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
          className='bg-emerald-600 hover:bg-emerald-700 h-11 text-base font-medium mb-2'
        >
          Verify
        </Button>
        <Button
          type='link'
          onClick={onResend}
          disabled={loading}
          className='text-emerald-600 text-sm'
        >
          Resend Code
        </Button>
      </div>
    </Modal>
  );
}
