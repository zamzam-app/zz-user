'use client';

import { useQuery } from '@tanstack/react-query';
import { Form, message } from 'antd';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DynamicReviewForm } from '@/components/review/DynamicReviewForm';
import { OtpStep } from '@/components/review/OtpStep';
import { SuccessStep } from '@/components/review/SuccessStep';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { cookieService } from '@/lib/services/cookie.service';
import { storage } from '@/lib/services/storage';
import { formApi } from '@/lib/services/api/form.api';
import { ratingApi } from '@/lib/services/api/rating.api';
import { authApi } from '@/lib/services/api/auth.api';
import type { CreateRatingDto, ResponseDto } from '@/types/rating';
import type { FormData, FormQuestion } from '@/types/form';

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

function buildCreateRatingDto(
  formId: string,
  outletId: string,
  userId: string,
  values: Record<string, unknown>,
  formData: FormData
): CreateRatingDto {
  const answers = (values.answers as Record<string, unknown>) ?? {};
  const complaints = (values.complaints as Record<string, boolean>) ?? {};
  const questions = activeQuestions(formData.questions);
  const response: ResponseDto[] = questions.map((q) => ({
    questionId: q._id,
    answer:
      (answers[q._id] as string | string[] | number) ??
      (q.type === 'checkbox' ? [] : q.type === 'rating' ? 0 : ''),
    isComplaint: Boolean(complaints[q._id]),
  }));
  const ratingQuestionIds = questions
    .filter((q) => q.type === 'rating')
    .map((q) => q._id);
  const ratingValues = ratingQuestionIds
    .map((id) => answers[id])
    .filter((v): v is number => typeof v === 'number');
  const overallRating =
    ratingValues.length > 0
      ? Math.min(
          5,
          Math.max(
            1,
            Math.round(
              (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length) *
                10
            ) / 10
          )
        )
      : undefined;
  return {
    formId,
    userId,
    outletId,
    response,
    ...(overallRating !== undefined && { overallRating }),
    type: 'review',
  };
}

export default function ReviewFormPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hydrateUser } = useAuth();
  const formId = params?.id as string;

  const [form] = Form.useForm();
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingValues, setPendingValues] = useState<Record<
    string,
    unknown
  > | null>(null);

  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formApi.getFormById(formId),
    enabled: !!formId,
  });

  const handleSubmit = useCallback((values: Record<string, unknown>) => {
    const phone = values.phone as string;
    if (!phone || phone.length !== 10) {
      message.error('Please enter a valid 10-digit phone number');
      return;
    }
    setPendingValues(values);
    setOtpModalOpen(true);
  }, []);

  const handleOtpVerify = useCallback(async () => {
    if (!otp || otp.length !== 6) {
      message.error('Please enter the 6-digit verification code');
      return;
    }
    if (!pendingValues || !formData) {
      message.error('Form data missing. Please try again.');
      return;
    }
    const phone = String(pendingValues.phone ?? '').trim();
    if (!phone || phone.length !== 10) {
      message.error('Invalid phone number.');
      return;
    }
    setSubmitting(true);
    try {
      const phoneNumber = `+91${phone}`;
      const authResponse = await authApi.verifyOtp({ phoneNumber, otp });
      cookieService.setAccessToken(authResponse.accessToken);
      storage.setToken(authResponse.accessToken);
      storage.setUser(authResponse.user);
      await hydrateUser();

      const userId = authResponse.user.id;
      const outletId =
        formData.outletId ?? searchParams.get('outletId') ?? formId;
      const payload = buildCreateRatingDto(
        formId,
        outletId,
        userId,
        pendingValues,
        formData
      );
      await ratingApi.create(payload);
      setOtpModalOpen(false);
      setOtp('');
      setPendingValues(null);
      setShowSuccess(true);
    } catch (err) {
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to submit review. Please try again.';
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  }, [otp, pendingValues, formData, formId, searchParams, hydrateUser]);

  const handleOtpResend = useCallback(() => {
    // TODO: call backend to resend OTP
    message.info('OTP resent');
  }, []);

  const handleFinishFailed = useCallback(
    (info: { errorFields: { errors: string[] }[] }) => {
      const firstError = info.errorFields?.[0]?.errors?.[0];
      message.error(firstError ?? 'Please fill all required fields');
    },
    []
  );

  if (!formId) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-gray-500'>Invalid form link.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-gray-500'>Loading form...</div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-6'>
        <p className='text-gray-500 text-center'>
          {error && typeof error === 'object' && 'message' in error
            ? String((error as { message: string }).message)
            : 'Failed to load form. Please try again later.'}
        </p>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className='min-h-screen bg-white'>
        <div className='max-w-md mx-auto h-full min-h-screen'>
          <SuccessStep onBackToHome={() => router.push('/')} />
        </div>
      </div>
    );
  }

  const activeForm = formData.isActive && !formData.isDeleted;
  if (!activeForm) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-gray-500'>This form is not available.</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-md mx-auto h-full min-h-screen'>
        <DynamicReviewForm
          form={form}
          questions={formData.questions}
          formTitle={formData.title}
          onSubmit={handleSubmit}
          onFinishFailed={handleFinishFailed}
          loading={false}
          onBack={() => router.back()}
        />
        <OtpStep
          open={otpModalOpen}
          onClose={() => {
            setOtpModalOpen(false);
            setOtp('');
          }}
          otp={otp}
          onOtpChange={setOtp}
          phoneNumber={String(pendingValues?.phone ?? '')}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          loading={submitting}
        />
      </div>
    </div>
  );
}
