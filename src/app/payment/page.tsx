'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Form, Radio, Divider } from 'antd';
import {
  CreditCard,
  Truck,
  CheckCircle,
  ChevronLeft,
  ShoppingBag,
} from 'lucide-react';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Extract query params for summary
  const type = searchParams.get('type');
  const size = searchParams.get('size');
  const flavor = searchParams.get('flavor');
  const shape = searchParams.get('shape');
  const msg = searchParams.get('message');
  const fileName = searchParams.get('fileName');

  const totalPrice = 45; // Mock price

  const handlePayment = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      // Mock API Simulation
      setTimeout(() => {
        setLoading(false);

        // Construct WhatsApp Message
        let text = `*New Order - ZAM ZAM*\n------------------\n`;
        if (type === 'custom') {
          text += `Type: Custom Cake\nShape: ${shape}\nFlavor: ${flavor}\nSize: ${size}\nMessage: ${msg || 'None'}\n`;
        } else {
          text += `Type: Custom Upload\nRef Image: ${fileName}\n`;
        }
        text += `Total Paid: $${totalPrice}\n------------------\nAddress: ${form.getFieldValue('address')}`;

        const encodedText = encodeURIComponent(text);
        const whatsappUrl = `https://wa.me/919999999999?text=${encodedText}`;

        // Redirect
        window.location.href = whatsappUrl;
      }, 2000);
    } catch {
      // Validation failed
    }
  };

  return (
    <div className='min-h-screen bg-[#FFF8F0] p-4 md:p-8'>
      <div className='max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-[#D4AF37]/10'>
        {/* Header */}
        <div className='bg-[#5D4037] p-6 text-white flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => router.back()}
              className='hover:bg-white/10 p-2 rounded-full transition-colors'
            >
              <ChevronLeft />
            </button>
            <h1 className='text-xl font-bold font-serif'>Checkout & Payment</h1>
          </div>
          <ShoppingBag className='opacity-50' />
        </div>

        <div className='flex flex-col md:flex-row'>
          {/* Order Summary Sidebar */}
          <div className='md:w-1/3 bg-gray-50 p-6 border-r border-gray-100'>
            <h3 className='font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider'>
              Order Summary
            </h3>

            <div className='space-y-4 text-sm'>
              <div className='flex justify-between items-start'>
                <span className='text-gray-500'>Item</span>
                <span className='font-medium text-right text-gray-800'>
                  {type === 'custom'
                    ? `${size} ${flavor} Cake`
                    : 'Custom Cake Design'}
                </span>
              </div>
              {type === 'custom' && (
                <>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Shape</span>
                    <span className='text-gray-800'>{shape}</span>
                  </div>
                  {msg && (
                    <div className='bg-white p-3 rounded-lg border border-gray-200 text-xs italic text-gray-500'>
                      Message: &quot;{msg}&quot;
                    </div>
                  )}
                </>
              )}
              <Divider className='my-2' />
              <div className='flex justify-between items-center text-lg font-bold text-[#5D4037]'>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className='mt-8 bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3'>
              <Truck size={18} className='text-[#D4AF37] mt-1 shrink-0' />
              <div>
                <h4 className='font-bold text-[#5D4037] text-xs mb-1'>
                  Estimated Delivery
                </h4>
                <p className='text-xs text-gray-600'>Tomorrow by 5:00 PM</p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className='flex-1 p-6 md:p-8'>
            <Form
              form={form}
              layout='vertical'
              initialValues={{ paymentMethod: 'card' }}
            >
              <h3 className='font-bold text-[#5D4037] mb-6 flex items-center gap-2'>
                <CheckCircle size={18} className='text-green-500' /> Shipping
                Details
              </h3>

              <Form.Item
                name='name'
                label='Full Name'
                rules={[{ required: true }]}
              >
                <Input size='large' placeholder='John Doe' />
              </Form.Item>
              <Form.Item
                name='address'
                label='Delivery Address'
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={2} placeholder='Your full address...' />
              </Form.Item>
              <Form.Item
                name='phone'
                label='Phone Number'
                rules={[{ required: true }]}
              >
                <Input size='large' placeholder='+91 98765 43210' prefix='📞' />
              </Form.Item>

              <Divider />

              <h3 className='font-bold text-[#5D4037] mb-6 flex items-center gap-2'>
                <CreditCard size={18} className='text-[#D4AF37]' /> Payment
                Method
              </h3>

              <Form.Item name='paymentMethod'>
                <Radio.Group className='w-full flex flex-col gap-3'>
                  <Radio
                    value='card'
                    className='border border-gray-200 p-4 rounded-xl flex items-center w-full hover:border-[#D4AF37] transition-colors [&.ant-radio-wrapper-checked]:border-[#D4AF37] [&.ant-radio-wrapper-checked]:bg-[#fffbf2]'
                  >
                    <span className='ml-2 font-medium'>
                      Credit / Debit Card
                    </span>
                    <div className='ml-auto flex gap-1'>
                      <div className='w-8 h-5 bg-gray-200 rounded'></div>
                      <div className='w-8 h-5 bg-gray-200 rounded'></div>
                    </div>
                  </Radio>
                  <Radio
                    value='upi'
                    className='border border-gray-200 p-4 rounded-xl flex items-center w-full hover:border-[#D4AF37] transition-colors [&.ant-radio-wrapper-checked]:border-[#D4AF37] [&.ant-radio-wrapper-checked]:bg-[#fffbf2]'
                  >
                    <span className='ml-2 font-medium'>UPI / GPay</span>
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                shouldUpdate={(prev, curr) =>
                  prev.paymentMethod !== curr.paymentMethod
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue('paymentMethod') === 'card' && (
                    <div className='bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 animate-in slide-in-from-top-2'>
                      <Input placeholder='Card Number' size='large' />
                      <div className='flex gap-4'>
                        <Input placeholder='MM/YY' size='large' />
                        <Input placeholder='CVC' size='large' />
                      </div>
                    </div>
                  )
                }
              </Form.Item>
            </Form>

            <Button
              type='primary'
              size='large'
              block
              onClick={handlePayment}
              loading={loading}
              className='mt-6 bg-[#5D4037] hover:bg-[#4a322c] h-14 text-lg font-bold shadow-xl shadow-[#5D4037]/20'
            >
              Pay ${totalPrice.toFixed(2)} & Order
            </Button>

            <p className='text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1'>
              <span className='w-2 h-2 bg-green-500 rounded-full'></span> Secure
              256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center text-[#5D4037]'>
          Loading Checkout...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
