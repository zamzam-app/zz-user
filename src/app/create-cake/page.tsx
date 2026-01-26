'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Tabs,
  Upload,
  Button,
  Form,
  Select,
  Input,
  Radio,
  message,
  Divider,
} from 'antd';
import {
  Upload as UploadIcon,
  Download,
  ShoppingBag,
  Cake as CakeIcon,
  ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const { Dragger } = Upload;
const { TextArea } = Input;

export default function CreateCakePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upload');
  const [cakeDesign, setCakeDesign] = useState<any>(null);

  const [form] = Form.useForm();

  const handleUploadChange = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      setCakeDesign({ type: 'upload', file: info.file });
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleCustomSubmit = (values: any) => {
    setCakeDesign({ type: 'custom', ...values });
  };

  const handleOrderNow = () => {
    if (!cakeDesign) {
      // If active tab is custom, try to submit form
      if (activeTab === 'custom') {
        form.submit();
        return; // form.onFinish will trigger handleCustomSubmit then we need to proceed.
        // Actually better to just check if form is valid or use current form values
      }
      if (activeTab === 'upload' && !cakeDesign) {
        return;
      }
    }

    // For simplicity, if we are in custom tab, let's grab values directly or assume they are in cakeDesign if saved.
    // Let's force a save if actively editing
    let orderData = cakeDesign;
    if (activeTab === 'custom') {
      const values = form.getFieldsValue();
      // Basic validation check
      if (!values.flavor || !values.shape) {
        message.error('Please select at least flavor and shape.');
        return;
      }
      orderData = { type: 'custom', ...values };
    } else if (activeTab === 'upload') {
      // Validate upload
      // In a real app we'd check if file exists.
      // For this mock, we assume if they are on tab upload they want to order from upload.
    }

    // Construct query params
    const params = new URLSearchParams();
    params.append('type', orderData.type);
    if (orderData.type === 'custom') {
      params.append('flavor', orderData.flavor);
      params.append('shape', orderData.shape);
      params.append('size', orderData.size);
      if (orderData.message) params.append('message', orderData.message);
    } else {
      params.append('fileName', 'Uploaded Image'); // In real app, upload ID
    }

    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className='min-h-screen bg-[#FFF8F0] pb-20'>
      {/* Header */}
      <header className='bg-white border-b border-gray-100 sticky top-0 z-10'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => router.back()}
              className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600'
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className='text-xl font-bold text-[#5D4037] font-serif'>
              Create Your Cake
            </h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/10'>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type='card'
            size='large'
            className='custom-tabs'
            items={[
              {
                key: 'upload',
                label: (
                  <span className='flex items-center gap-2 px-4 py-2'>
                    <UploadIcon size={18} /> Upload Reference
                  </span>
                ),
                children: (
                  <div className='p-8'>
                    <div className='text-center mb-8'>
                      <h2 className='text-2xl font-bold text-[#5D4037] mb-2'>
                        Have a design in mind?
                      </h2>
                      <p className='text-gray-500'>
                        Upload a picture from Pinterest, Instagram, or your
                        sketches.
                      </p>
                    </div>

                    <div className='max-w-xl mx-auto'>
                      <Dragger
                        name='file'
                        multiple={false}
                        action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                        onChange={handleUploadChange}
                        className='bg-gray-50 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-3xl p-10'
                      >
                        <div className='ant-upload-drag-icon flex justify-center mb-4'>
                          <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#D4AF37]'>
                            <UploadIcon size={32} />
                          </div>
                        </div>
                        <p className='ant-upload-text text-lg font-medium text-gray-700'>
                          Click or drag file to this area to upload
                        </p>
                        <p className='ant-upload-hint text-gray-400 mt-2'>
                          Support for multiple images for reference.
                        </p>
                      </Dragger>

                      <div className='mt-8'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Additional Notes
                        </label>
                        <TextArea
                          rows={4}
                          placeholder='Any specific instructions about colors, flavors, or dietary restrictions?'
                        />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'custom',
                label: (
                  <span className='flex items-center gap-2 px-4 py-2'>
                    <CakeIcon size={18} /> Build Custom
                  </span>
                ),
                children: (
                  <div className='p-8 grid md:grid-cols-2 gap-12'>
                    {/* Form Side */}
                    <div>
                      <h2 className='text-2xl font-bold text-[#5D4037] mb-6'>
                        Customize Details
                      </h2>
                      <Form
                        form={form}
                        layout='vertical'
                        onFinish={handleCustomSubmit}
                        initialValues={{
                          shape: 'round',
                          size: '1kg',
                          flavor: 'chocolate',
                        }}
                      >
                        <Form.Item name='shape' label='Shape'>
                          <Radio.Group
                            buttonStyle='solid'
                            className='w-full grid grid-cols-3 gap-2'
                          >
                            <Radio.Button value='round' className='text-center'>
                              Round
                            </Radio.Button>
                            <Radio.Button
                              value='square'
                              className='text-center'
                            >
                              Square
                            </Radio.Button>
                            <Radio.Button value='heart' className='text-center'>
                              Heart
                            </Radio.Button>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item name='flavor' label='Flavor'>
                          <Select
                            size='large'
                            options={[
                              {
                                value: 'chocolate',
                                label: 'Belgian Chocolate',
                              },
                              { value: 'vanilla', label: 'Classic Vanilla' },
                              { value: 'redvelvet', label: 'Red Velvet' },
                              { value: 'butterscotch', label: 'Butterscotch' },
                              { value: 'fruit', label: 'Fresh Fruit' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item name='size' label='Size (Weight)'>
                          <Select
                            size='large'
                            options={[
                              { value: '0.5kg', label: '0.5 kg (Serves 4-6)' },
                              { value: '1kg', label: '1 kg (Serves 8-10)' },
                              { value: '2kg', label: '2 kg (Serves 15-20)' },
                              { value: '3kg', label: '3 kg (Party Size)' },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item name='message' label='Message on Cake'>
                          <Input
                            size='large'
                            placeholder='Happy Birthday...'
                            maxLength={30}
                            showCount
                          />
                        </Form.Item>
                      </Form>
                    </div>

                    {/* Preview Side */}
                    <div className='bg-[#fffbf2] rounded-3xl p-6 flex flex-col items-center justify-center border border-[#D4AF37]/10 relative min-h-[400px]'>
                      <span className='absolute top-4 right-4 text-xs font-bold text-[#D4AF37] uppercase tracking-widest'>
                        Preview
                      </span>

                      {/* Dynamic Cake Visual (Simplified CSS approach) */}
                      <div className='relative w-64 h-64 mb-8 transition-all'>
                        {/* Base */}
                        <div className='absolute bottom-0 w-full h-32 bg-[#8B4513] rounded-2xl shadow-2xl transform rotate-x-12 translate-y-4'></div>
                        {/* Design Overlay Placeholders */}
                        <div className='w-full h-full bg-linear-to-b from-[#b3866c] to-[#8B4513] rounded-full shadow-inner flex items-center justify-center relative z-10'>
                          <span className='font-handwriting text-white text-xl font-bold rotate-[-5deg] drop-shadow-md'>
                            {/* We could bind active form message here if we watched form values */}
                            Your Cake
                          </span>
                        </div>
                      </div>

                      <div className='space-y-2 w-full'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>
                            Base Price (1kg)
                          </span>
                          <span className='font-bold text-[#5D4037]'>
                            $35.00
                          </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-500'>Customization</span>
                          <span className='font-bold text-[#5D4037]'>
                            $10.00
                          </span>
                        </div>
                        <Divider className='my-2' />
                        <div className='flex justify-between text-lg font-bold'>
                          <span className='text-[#5D4037]'>Total Est.</span>
                          <span className='text-[#D4AF37]'>$45.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Action Bar */}
        <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20'>
          <div className='container mx-auto max-w-4xl flex justify-between items-center gap-4'>
            <Button
              size='large'
              icon={<Download size={18} />}
              className='hidden md:flex'
            >
              Download Design
            </Button>
            <div className='flex-1 md:flex-none flex gap-4 w-full md:w-auto'>
              <Button
                size='large'
                type='primary'
                block
                className='bg-[#5D4037] hover:bg-[#4a322c] h-12 text-lg shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2'
                onClick={handleOrderNow}
              >
                <ShoppingBag size={20} /> Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
