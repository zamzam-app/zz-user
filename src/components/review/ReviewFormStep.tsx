'use client';

import type { FormInstance } from 'antd';
import { Button, Form, Input, Rate, Select } from 'antd';
import { ChevronLeft } from 'lucide-react';

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

export type ReviewFormStepProps = {
  storeName: string;
  form: FormInstance;
  onSubmit: (values: Record<string, unknown>) => void;
  onBack: () => void;
  loading: boolean;
};

export function ReviewFormStep({
  storeName,
  form,
  onSubmit,
  onBack,
  loading,
}: ReviewFormStepProps) {
  return (
    <div className='pb-24 pt-4'>
      <div className='px-4 py-3 flex items-center border-b border-gray-100 mb-4'>
        <button
          onClick={onBack}
          className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2'
        >
          <ChevronLeft size={24} className='text-gray-700' />
        </button>
        <h1 className='text-lg font-semibold text-gray-800 flex-1'>
          Give Feedback
        </h1>
      </div>

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
          onFinish={onSubmit}
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
}
