'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Rate, Form, message } from 'antd';
import { ChevronLeft } from 'lucide-react';

// Mock Constants - In a real app, these might come from an API or shared constants file
const SERVICE_TYPES = [
  { value: 'dine-in', label: 'Dine In' },
  { value: 'takeaway', label: 'Takeaway' },
  { value: 'delivery', label: 'Delivery' },
];

const SERVICE_CATEGORIES = [
  { value: 'food', label: 'Food Quality' },
  { value: 'service', label: 'Service Speed' },
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'cleanliness', label: 'Cleanliness' },
];

export default function QRFormPage() {
  const params = useParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<0 | 1 | 2 | 3>(0); // 0: Phone, 1: OTP, 2: Form, 3: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const storeId = params?.id as string;

  // Mock store data fetch
  const storeName = `Outlet #${storeId}`; // Placeholder

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      message.error('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    // Simulate API call to send OTP
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
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    // Simulate form submission
    console.log('Form Values:', { ...values, storeId, phoneNumber });
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 1500);
  };

  const renderPhoneStep = () => (
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
              if (val.length <= 10) setPhoneNumber(val);
            }}
            maxLength={10}
            className='w-full'
          />
        </div>
        <Button
          type='primary'
          block
          size='large'
          onClick={handlePhoneSubmit}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium'
        >
          Send OTP
        </Button>
      </div>
    </div>
  );

  const renderOtpStep = () => (
    <div className='flex flex-col h-full justify-center px-6'>
      <Button
        type='text'
        icon={<ChevronLeft />}
        className='absolute top-4 left-4'
        onClick={() => setCurrentStep(0)}
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
          <Input.OTP length={4} value={otp} onChange={setOtp} size='large' />
        </div>
        <Button
          type='primary'
          block
          size='large'
          onClick={handleOtpSubmit}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium'
        >
          Verify
        </Button>
        <div className='text-center'>
          <Button
            type='link'
            onClick={handlePhoneSubmit}
            disabled={loading}
            className='text-emerald-600'
          >
            Resend Code
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFormStep = () => (
    <div className='pb-24 pt-4'>
      <div className='px-6 mb-6'>
        <h2 className='text-2xl font-serif font-medium text-gray-800 text-center'>
          {storeName}
        </h2>
        <p className='text-center text-gray-500 text-sm mt-1'>
          We value your feedback
        </p>
      </div>

      <div className='px-6'>
        <Form
          form={form}
          layout='vertical'
          onFinish={handleFormSubmit}
          initialValues={{ rating: 5 }}
          size='large'
        >
          <Form.Item name='customerName' label='Customer Name'>
            <Input placeholder='Enter your name (optional)' />
          </Form.Item>

          <Form.Item
            name='serviceType'
            label='Service Type'
            rules={[
              { required: true, message: 'Please select a service type' },
            ]}
          >
            <Select placeholder='Select Service Type' options={SERVICE_TYPES} />
          </Form.Item>

          <Form.Item name='category' label='Service Category'>
            <Select
              placeholder='Select Service Category'
              options={SERVICE_CATEGORIES}
            />
          </Form.Item>

          <Form.Item
            name='rating'
            label='Rate Your Experience'
            className='text-center'
          >
            <div className='flex justify-center py-2 bg-gray-50 rounded-xl border border-gray-100 border-dashed'>
              <Rate className='text-amber-400 text-3xl' allowHalf />
            </div>
          </Form.Item>

          <Form.Item name='description' label='Short Description'>
            <Input.TextArea
              rows={4}
              placeholder='Tell us more about your experience...'
              className='resize-none'
            />
          </Form.Item>
        </Form>
      </div>

      <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10'>
        <Button
          type='primary'
          block
          size='large'
          onClick={() => form.submit()}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium shadow- emerald-200'
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className='flex flex-col items-center justify-center min-h-[80vh] px-6 text-center'>
      <div className='w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce'>
        <svg
          className='w-10 h-10 text-emerald-600'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={3}
            d='M5 13l4 4L19 7'
          />
        </svg>
      </div>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Thank You!</h1>
      <p className='text-gray-500 text-lg mb-8 max-w-xs mx-auto'>
        Your feedback helps us improve our service at ZamZam.
      </p>
      <div className='w-full max-w-sm rounded-2xl overflow-hidden mb-8 shadow-xl border border-gray-100'>
        {/* Placeholder image */}
        <div className='bg-gray-200 h-48 w-full flex items-center justify-center text-gray-400'>
          Restaurant Image
        </div>
      </div>
      <Button
        size='large'
        onClick={() => router.push('/')}
        className='min-w-[160px]'
      >
        Back to Home
      </Button>
    </div>
  );

  return (
    <div className='min-h-screen bg-white'>
      {/* Header for non-success steps */}
      {currentStep !== 3 && (
        <div className='sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center'>
          {currentStep === 2 && (
            <button
              onClick={() => setCurrentStep(0)}
              className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2'
            >
              <ChevronLeft size={24} className='text-gray-700' />
            </button>
          )}
          <h1 className='text-lg font-semibold text-gray-800 flex-1'>
            {currentStep === 0 && 'Login'}
            {currentStep === 1 && 'Authentication'}
            {currentStep === 2 && 'Give Feedback'}
          </h1>
        </div>
      )}

      <div className='max-w-md mx-auto h-full min-h-[calc(100vh-60px)]'>
        {currentStep === 0 && renderPhoneStep()}
        {currentStep === 1 && renderOtpStep()}
        {currentStep === 2 && renderFormStep()}
        {currentStep === 3 && renderSuccessStep()}
      </div>
    </div>
  );
}
