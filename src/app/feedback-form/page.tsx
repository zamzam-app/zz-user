'use client';

import { Form, Input, Rate, Button, Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  Upload as UploadIcon,
  ChevronLeft,
  Send,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;
const { TextArea } = Input;

export default function FeedbackPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const normFile = (e:  UploadChangeParam<UploadFile>) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = () => {
    message.success('Thank you for your feedback!');
    setTimeout(() => router.push('/'), 1500);
  };

  return (
    <div className='min-h-screen bg-[#FFF8F0] pb-20'>
      {/* Header */}
      <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
        <div className='container mx-auto px-4 h-16 flex items-center gap-2'>
          <button
            onClick={() => router.back()}
            className='p-2 hover:bg-gray-100 rounded-full text-gray-600'
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className='text-xl font-bold text-[#5D4037] font-serif'>
            Leave a Review
          </h1>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {/* Main Card */}
        <div className='bg-white rounded-3xl shadow-xl border border-[#D4AF37]/10 p-6 md:p-10'>
          <div className='text-center mb-10'>
            <h2 className='text-2xl font-bold text-[#5D4037] mb-2'>
              How was your experience?
            </h2>
            <p className='text-gray-500'>
              Your feedback helps us bake better every time 🍰
            </p>
          </div>

          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            requiredMark={false}
            className='space-y-6'
          >
            {/* STEP 1 */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-lg text-[#5D4037] mb-4'>
              Overall Rating
              </h2>

              <div className='mt-5'>
                <Form.Item
                  name='rating'
                  rules={[{ required: true }]}
                  className='mb-0'
                >
                  <Rate
                    character={<Star size={28} fill='currentColor' />}
                    className='text-[#D4AF37]'
                  />
                </Form.Item>
              </div>
            </section>

            {/* STEP 2 */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-lg text-[#5D4037] mb-4'>
                Upload Photos
              </h2>

              <Form.Item
                name='photos'
                valuePropName='fileList'
                getValueFromEvent={normFile}
                className='mb-0'
              >
                <Dragger
                  multiple
                  className='bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl p-8'
                >
                  <div className='flex flex-col items-center'>
                    <div className='w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-[#D4AF37] mb-3'>
                      <UploadIcon size={28} />
                    </div>
                    <p className='font-medium text-gray-700'>
                      Upload cake photos
                    </p>
                    <p className='text-sm text-gray-400'>
                      Real photos help other customers
                    </p>
                  </div>
                </Dragger>
              </Form.Item>
            </section>

            {/* STEP 3 */}
            <section className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
              <h2 className='text-lg text-[#5D4037] mb-4'>
              Write a Review
              </h2>

              <Form.Item
                name='comment'
                rules={[{ required: true }]}
                className='mb-0'
              >
                <TextArea
                  rows={4}
                  placeholder='Taste, design, delivery experience...'
                  className='rounded-xl bg-gray-50 border-gray-100 p-4'
                />
              </Form.Item>
            </section>
          </Form>
        </div>
      </div>

      {/* Footer */}
      <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20'>
        <div className='container mx-auto max-w-4xl flex justify-center'>
          <Button
            type='primary'
            size='large'
            onClick={() => form.submit()}
            className='bg-[#5D4037] hover:bg-[#4a322c] h-12 text-lg shadow-lg shadow-orange-900/10 flex items-center gap-2 min-w-[280px] border-none'
          >
            <Send size={20} />
            Submit Feedback
          </Button>
        </div>
      </div>
    </div>
  );
}
