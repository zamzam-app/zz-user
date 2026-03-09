'use client';

import type { FormInstance } from 'antd';
import { Button, Checkbox, DatePicker, Form, Input, Rate, Radio } from 'antd';
import { useCallback, useState } from 'react';
import { ComplaintModal } from '@/components/review/ComplaintModal';
import type { CreateReviewDto } from '@/types/review';
import type { FormData, FormQuestion } from '@/types/form';
import { StarOutlined, StarFilled } from '@ant-design/icons';

export type DynamicReviewFormProps = {
  form: FormInstance;
  questions: FormQuestion[];
  formTitle: string;
  formId?: string;
  outletId?: string;
  formData?: FormData;
  userId?: string;
  onSubmit: (values: Record<string, unknown>) => void;
  onFinishFailed?: (info: { errorFields: Array<{ errors: string[] }> }) => void;
  onSubmitComplaint?: (payload: CreateReviewDto) => void | Promise<void>;
  loading: boolean;
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
  character?: (props: { index?: number; value?: number }) => React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className='flex justify-center'>
      <Rate
        value={value}
        onChange={onChange}
        count={count}
        allowHalf={allowHalf}
        disabled={disabled}
        style={{ fontSize: 48 }}
        character={({ index = 0, value = 0 }) => {
          const selected = index + 1 <= value;
          return selected ? (
            <StarFilled style={{ margin: '0 8px', color: '#3DCA84' }} />
          ) : (
            <StarOutlined style={{ margin: '0 8px', color: '#3DCA84' }} />
          );
        }}
      />
    </div>
  );
}
export function DynamicReviewForm({
  form,
  questions,
  formTitle,
  formId,
  outletId,
  formData,
  userId,
  onSubmit,
  onFinishFailed,
  onSubmitComplaint,
  loading,
}: DynamicReviewFormProps) {
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const questionsToShow = activeQuestions(questions);

  const handleComplaintSubmit = useCallback(
    async (payload: CreateReviewDto) => {
      await onSubmitComplaint?.(payload);
      setComplaintModalOpen(false);
    },
    [onSubmitComplaint]
  );

  return (
    <div className='pb-24 pt-4'>
      {/* Header */}
      <header className='relative flex items-center justify-center px-6 py-4'>
        <h1 className="font-['Epilogue'] font-extrabold tracking-tight text-gray-900 text-base sm:text-xl md:text-2xl lg:text-3xl truncate max-w-[70%] text-center translate-y-1 md:translate-y-2">
          Feedback Form
        </h1>
      </header>
      <div className='px-6 mb-8 pt-2'>
        <h2 className="font-['Epilogue'] font-semibold text-[22px] text-gray-900 text-center">
          {formTitle}
        </h2>
      </div>

      <div className=' px-6 review-form-no-inline-errors'>
        <Form
          form={form}
          layout='vertical'
          onFinish={onSubmit}
          onFinishFailed={onFinishFailed}
          size='large'
          className='space-y-5 '
        >
          {/* NAME */}
          <Form.Item
            name='name'
            label={
              <span className="font-['Epilogue'] text-gray-700 font-medium">
                Name
              </span>
            }
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input
              placeholder='Enter your name'
              className='w-full rounded-xl px-4 py-4 h-12
             border-none! 
             bg-[#F1F5F3]! 
             text-[#4A6D5F]! 
             placeholder-[#8FA39B]! 
             transition-all
             focus:ring-2! 
             focus:ring-[#3DCA84]! 
             focus:outline-none!'
            />
          </Form.Item>

          {/* PHONE */}
          <Form.Item
            name='phone'
            label={
              <span className="font-['Epilogue'] text-gray-700 font-medium">
                Phone Number
              </span>
            }
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
              prefix={
                <span className='text-[#4A6D5F] font-medium mr-1'>+91</span>
              }
              maxLength={10}
              className='w-full rounded-xl px-4 py-4 h-12
                         border-none! 
                         border-transparent!
                         shadow-none!
                         bg-[#F1F5F3]! 
                         text-[#4A6D5F]! 
                         placeholder-[#8FA39B]! 
                         transition-all
                         /* no borders appear on hover */
                         [&.ant-input-affix-wrapper]:border-none!
                         [&.ant-input-affix-wrapper]:border-transparent!
                         [&.ant-input-affix-wrapper]:shadow-none!
                         [&.ant-input-affix-wrapper]:bg-[#F1F5F3]!
                         [&.ant-input-affix-wrapper:hover]:border-none!
                         [&.ant-input-affix-wrapper:hover]:border-transparent!

                         /*  Green Ring*/
                         [&.ant-input-affix-wrapper-focused]:border-none!
                         [&.ant-input-affix-wrapper-focused]:border-transparent!
                         [&.ant-input-affix-wrapper-focused]:shadow-none!
                         [&.ant-input-affix-wrapper-focused]:ring-2!
                         [&.ant-input-affix-wrapper-focused]:ring-[#3DCA84]!
                         focus:outline-none!
                         focus:border-none!'
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                form.setFieldValue('phone', val);
              }}
            />
          </Form.Item>
          {/* EMAIL */}
          <Form.Item
            name='email'
            label={
              <span className="font-['Epilogue'] text-gray-700 font-medium">
                Email (optional)
              </span>
            }
          >
            <Input
              type='email'
              placeholder='Enter your email'
              className='w-full rounded-xl px-4 py-4 h-12
             border-none! 
             bg-[#F1F5F3]! 
             text-[#4A6D5F]! 
             placeholder-[#8FA39B]! 
             transition-all
             focus:ring-2! 
             focus:ring-[#3DCA84]! 
             focus:outline-none!'
            />
          </Form.Item>

          {/* DOB */}
          <Form.Item
            name='dob'
            label={
              <span className="font-['Epilogue'] text-gray-700 font-medium">
                Date of Birth (optional)
              </span>
            }
          >
            <DatePicker
              placeholder='Select date of birth'
              format='DD/MM/YYYY'
              className='w-full rounded-xl px-4 py-4 h-12
              border-none! 
              bg-[#F1F5F3]! 
              text-[#4A6D5F]! 
              [&.ant-picker]:border-none!
              [&.ant-picker]:shadow-none!
              [&.ant-picker]:bg-[#F1F5F3]!
              [&.ant-picker:hover]:border-none!
              [&.ant-picker:hover]:bg-[#F1F5F3]!
              /*Focus State - Green Ring */
              [&.ant-picker-focused]:ring-2!
              [&.ant-picker-focused]:ring-[#3DCA84]!
              [&.ant-picker-focused]:shadow-none!
              transition-all'
            />
          </Form.Item>

          {/* DYNAMIC QUESTIONS */}
          {questionsToShow.map((question, index) => {
            const isOverallRating =
              question.type === 'rating' &&
              question.title?.toLowerCase().includes('overall rating');
            const questionNumber = isOverallRating
              ? null
              : questionsToShow
                  .slice(0, index + 1)
                  .filter(
                    (q) =>
                      !(
                        q.type === 'rating' &&
                        q.title?.toLowerCase().includes('overall rating')
                      )
                  ).length;
            const labelText =
              questionNumber != null
                ? `${questionNumber}. ${question.title}`
                : question.title;

            return (
              <div key={question._id} className='space-y-2'>
                <Form.Item
                  name={['answers', question._id]}
                  label={
                    <span className="font-['Epilogue'] text-gray-800 font-semibold">
                      {labelText}
                    </span>
                  }
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
                      <span className='text-gray-400 text-sm'>
                        {question.hint}
                      </span>
                    ) : undefined
                  }
                >
                  {question.type === 'rating' && (
                    <div className='rounded-2xl py-6 flex flex-col items-center justify-center gap-3'>
                      <RateField
                        value={form.getFieldValue(['answers', question._id])}
                        onChange={(val) =>
                          form.setFieldValue(['answers', question._id], val)
                        }
                        count={question.maxRatings ?? 5}
                        allowHalf={question.starStep === 0.5}
                      />
                    </div>
                  )}

                  {question.type === 'short_answer' && (
                    <Input
                      placeholder='Your answer'
                      className='w-full rounded-xl px-4 py-4 h-12
                                 border-none! 
                               bg-[#F1F5F3]! 
                               text-[#4A6D5F]! 
                               placeholder-[#8FA39B]! 
                                 transition-all
                                 focus:ring-2! 
                                 focus:ring-[#3DCA84]! 
                                 focus:outline-none!'
                    />
                  )}

                  {question.type === 'paragraph' && (
                    <Input.TextArea
                      rows={4}
                      placeholder='Your answer'
                      className='w-full rounded-xl px-4 py-4 h-12
                                 border-none! 
                               bg-[#F1F5F3]! 
                               text-[#32403B]! 
                               placeholder-[#8FA39B]! 
                                 transition-all
                                 focus:ring-2! 
                               focus:ring-[#4A6D5F]! 
                                 focus:outline-none!'
                    />
                  )}
                  {question.type === 'multiple_choice' && (
                    <Form.Item
                      name={['answers', question._id]}
                      noStyle // This removes the wrapper that causes the extra outline
                    >
                      <Radio.Group className='flex flex-col gap-3 mt-2 mb-4'>
                        {(question.options ?? []).map((opt, idx) => (
                          <div key={idx} className='block'>
                            <Radio
                              value={opt.text}
                              className="text-gray-700 font-medium font-['Epilogue'] border-none! outline-none!
                             [&.ant-radio-wrapper:hover_.ant-radio-inner]:border-[#3DCA84]!
                             [&_.ant-radio-checked_.ant-radio-inner]:border-[#3DCA84]!
                             [&_.ant-radio-checked_.ant-radio-inner]:bg-white!
                             [&_.ant-radio-inner:after]:bg-[#3DCA84]!
                             [&_.ant-radio-input:focus+.ant-radio-inner]:shadow-none!
                             [&.ant-radio-wrapper:hover]:bg-transparent!
                             "
                            >
                              {opt.text}
                            </Radio>
                          </div>
                        ))}
                      </Radio.Group>
                    </Form.Item>
                  )}

                  {question.type === 'checkbox' && (
                    <Checkbox.Group className='flex flex-col gap-2'>
                      {(question.options ?? []).map((opt, idx) => (
                        <Checkbox key={idx} value={opt.text}>
                          {opt.text}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </div>
            );
          })}
        </Form>

        <div className='flex justify-center mt-6 mb-6'>
          <button
            type='button'
            onClick={() => setComplaintModalOpen(true)}
            className="font-['Epilogue'] text-sm font-medium py-2.5 px-6 rounded-xl bg-white text-black border border-black transition-all hover:opacity-90"
          >
            Report a complaint
          </button>
        </div>
      </div>

      {formId != null && outletId != null && formData != null && (
        <ComplaintModal
          open={complaintModalOpen}
          onClose={() => setComplaintModalOpen(false)}
          formId={formId}
          outletId={outletId}
          form={form}
          formData={formData}
          userId={userId}
          onSubmit={handleComplaintSubmit}
        />
      )}

      <div className='fixed bottom-0 left-0 right-0 p-4  z-10'>
        <Button
          type='primary'
          block
          size='large'
          onClick={() => form.submit()}
          loading={loading}
          className=" font-['Epilogue']! text-gray-700! font-medium
      h-14 rounded-2xl text-lg border-none! transition-all
      bg-[#3DCA84]! 
      hover:bg-[#34b375]! 
      hover:text-[#1C2B25]!
      active:scale-[0.98]!
    "
        >
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
