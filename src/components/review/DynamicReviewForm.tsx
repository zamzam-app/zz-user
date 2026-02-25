'use client';

import type { FormInstance } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input, Rate, Radio } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import type { FormQuestion } from '@/types/form';

export type DynamicReviewFormProps = {
  form: FormInstance;
  questions: FormQuestion[];
  formTitle: string;
  onSubmit: (values: Record<string, unknown>) => void;
  onFinishFailed?: (info: { errorFields: Array<{ errors: string[] }> }) => void;
  loading: boolean;
  onBack?: () => void;
};

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

function RateField({
  value,
  onChange,
  count = 5,
  allowHalf,
  disabled,
}: {
  value?: number;
  onChange?: (value: number) => void;
  count?: number;
  allowHalf?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className='flex justify-center py-2 bg-gray-50 rounded-xl border border-gray-100 border-dashed'>
      <Rate
        value={value}
        onChange={onChange}
        count={count}
        className='text-amber-400 text-3xl'
        allowHalf={allowHalf}
        disabled={disabled}
      />
    </div>
  );
}

export function DynamicReviewForm({
  form,
  questions,
  formTitle,
  onSubmit,
  onFinishFailed,
  loading,
  onBack,
}: DynamicReviewFormProps) {
  const questionsToShow = activeQuestions(questions);

  const ratingQuestionIds = useMemo(
    () => questionsToShow.filter((q) => q.type === 'rating').map((q) => q._id),
    [questionsToShow]
  );
  const firstRatingId = ratingQuestionIds[0];
  const isMultipleRatings = ratingQuestionIds.length > 1;

  const answers = Form.useWatch('answers', form) ?? {};
  const ratingValuesKey = JSON.stringify(
    ratingQuestionIds.map((id) => answers[id as keyof typeof answers])
  );

  useEffect(() => {
    if (!firstRatingId) return;
    const currentAnswers = form.getFieldValue('answers') ?? {};
    const values = ratingQuestionIds
      .map((id) => currentAnswers[id])
      .filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const rounded = Math.round(avg * 10) / 10;
    const current = currentAnswers[firstRatingId];
    if (typeof current !== 'number' || Math.abs(rounded - current) > 0.01) {
      form.setFieldValue(['answers', firstRatingId], rounded);
    }
  }, [ratingValuesKey, form, firstRatingId, ratingQuestionIds]);

  return (
    <div className='pb-24 pt-4'>
      <div className='px-4 py-3 flex items-center border-b border-gray-100 mb-4'>
        {onBack && (
          <button
            onClick={onBack}
            className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2'
          >
            <ChevronLeft size={24} className='text-gray-700' />
          </button>
        )}
        <h1 className='text-lg font-semibold text-gray-800 flex-1'>
          Give Feedback
        </h1>
      </div>

      <div className='px-6 mb-6'>
        <h2 className='text-2xl font-serif font-medium text-gray-800 text-center'>
          {formTitle}
        </h2>
        <p className='text-center text-gray-500 text-sm mt-1'>
          We value your feedback
        </p>
      </div>

      <div className='px-6 review-form-no-inline-errors'>
        <Form
          form={form}
          layout='vertical'
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          size='large'
        >
          <Form.Item
            name='name'
            label='Name'
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder='Enter your name' />
          </Form.Item>

          <Form.Item
            name='phone'
            label='Phone Number'
            rules={[
              { required: true, message: 'Please enter your phone number' },
              {
                pattern: /^\d{10}$/,
                message: 'Please enter a valid 10-digit phone number',
              },
            ]}
          >
            <Input
              placeholder='Enter your phone number'
              prefix={<span className='text-gray-400'>+91</span>}
              maxLength={10}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                form.setFieldValue('phone', val);
              }}
            />
          </Form.Item>

          <Form.Item name='email' label='Email (optional)'>
            <Input type='email' placeholder='Enter your email' />
          </Form.Item>

          <Form.Item name='dob' label='Date of Birth (optional)'>
            <DatePicker
              className='w-full'
              placeholder='Select date of birth'
              format='DD/MM/YYYY'
            />
          </Form.Item>

          {questionsToShow.map((question) => {
            const isOverallRating =
              question.type === 'rating' &&
              firstRatingId === question._id &&
              isMultipleRatings;
            return (
              <div key={question._id} className='mb-4'>
                <Form.Item
                  name={['answers', question._id]}
                  label={question.title}
                  rules={
                    question.isRequired
                      ? [
                          {
                            required: true,
                            message: `Please answer: ${question.title}`,
                          },
                        ]
                      : undefined
                  }
                  extra={
                    question.hint ? (
                      <span className='text-gray-500 text-sm'>
                        {question.hint}
                      </span>
                    ) : undefined
                  }
                >
                  {question.type === 'rating' && (
                    <RateField
                      count={question.maxRatings ?? 5}
                      allowHalf={question.starStep === 0.5}
                      disabled={isOverallRating}
                    />
                  )}
                  {question.type === 'short_answer' && (
                    <Input placeholder='Your answer' />
                  )}
                  {question.type === 'paragraph' && (
                    <Input.TextArea
                      rows={4}
                      placeholder='Your answer'
                      className='resize-none'
                    />
                  )}
                  {question.type === 'multiple_choice' && (
                    <Radio.Group className='w-full'>
                      {(question.options ?? []).map((opt, idx) => (
                        <Radio
                          key={idx}
                          value={opt.text}
                          className='block my-1'
                        >
                          {opt.text}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                  {question.type === 'checkbox' && (
                    <Checkbox.Group className='w-full flex flex-col gap-1'>
                      {(question.options ?? []).map((opt, idx) => (
                        <Checkbox key={idx} value={opt.text}>
                          {opt.text}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                </Form.Item>
                <Form.Item
                  name={['complaints', question._id]}
                  valuePropName='checked'
                  className='mb-0'
                >
                  <Checkbox>Mark as complaint</Checkbox>
                </Form.Item>
              </div>
            );
          })}
        </Form>
      </div>

      <div className='fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10'>
        <Button
          type='primary'
          block
          size='large'
          onClick={() => form.submit()}
          loading={loading}
          className='bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-medium'
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
