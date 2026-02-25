'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, message } from 'antd';
import { OtpStep } from '@/components/review/OtpStep';
import { PhoneStep } from '@/components/review/PhoneStep';
import { ReviewFormStep } from '@/components/review/ReviewFormStep';
import { SuccessStep } from '@/components/review/SuccessStep';

export default function QRFormPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const storeId = params?.id as string;
  const storeName = `Outlet #${storeId}`;

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      message.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(1);
    }, 1000);
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length < 4) {
      message.error('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    console.log('Form Values:', { ...values, storeId, phoneNumber });
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 1500);
  };

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-md mx-auto h-full min-h-screen'>
        {currentStep === 0 && (
          <PhoneStep
            phoneNumber={phoneNumber}
            onPhoneChange={setPhoneNumber}
            onSubmit={handlePhoneSubmit}
            loading={loading}
          />
        )}
        {currentStep === 1 && (
          <OtpStep
            otp={otp}
            onOtpChange={setOtp}
            phoneNumber={phoneNumber}
            onVerify={handleOtpSubmit}
            onResend={handlePhoneSubmit}
            onBack={() => setCurrentStep(0)}
            loading={loading}
          />
        )}
        {currentStep === 2 && (
          <ReviewFormStep
            storeName={storeName}
            form={form}
            onSubmit={handleFormSubmit}
            onBack={() => setCurrentStep(0)}
            loading={loading}
          />
        )}
        {currentStep === 3 && (
          <SuccessStep onBackToHome={() => router.push('/')} />
        )}
      </div>
    </div>
  );
}
