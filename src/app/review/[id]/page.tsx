'use client';

import { useQuery } from '@tanstack/react-query';
import { Form, App } from 'antd'; // ✅ FIXED
import { useParams, useSearchParams } from 'next/navigation';
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
import type { FormData, FormQuestion } from '@/types/form';

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

export default function ReviewFormPage() {
  const { message } = App.useApp(); // ✅ REQUIRED

  const params = useParams();
  const searchParams = useSearchParams();
  const { user, hydrateUser } = useAuth();
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
  const [pendingRatingSubmit, setPendingRatingSubmit] = useState<{
    values: Record<string, unknown>;
    formData: FormData;
    userId: string | null;
  } | null>(null);

  const {
    data: formData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formApi.getFormById(formId),
    enabled: !!formId,
  });

  const handleSubmit = useCallback(
    (values: Record<string, unknown>) => {
      const phone = values.phone as string;
      if (!phone || phone.length !== 10) {
        message.error('Please enter a valid 10-digit phone number');
        return;
      }
      setPendingValues(values);
      setOtpModalOpen(true);
    },
    [message]
  );

  const handleOtpVerify = async () => {
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

      const userId =
        authResponse.user?.id ??
        (authResponse.user as { _id?: string })?._id ??
        null;

      const outletId =
        formData.outletId ?? searchParams.get('outletId') ?? formId;

      await ratingApi.create({
        formId,
        userId,
        outletId,
        response: [],
        type: 'review',
      });

      setShowSuccess(true);
      setOtpModalOpen(false);
      setOtp('');
      setPendingValues(null);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'status' in err &&
        (err as { status?: number }).status === 401
      ) {
        message.error('Incorrect OTP');
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        message.error(String((err as { message?: string }).message));
      } else {
        message.error('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  const handleOtpResend = useCallback(() => {
    message.info('OTP resent');
  }, [message]);

  const handleFinishFailed = useCallback(
    (info: { errorFields: { errors: string[] }[] }) => {
      const firstError = info.errorFields?.[0]?.errors?.[0];
      message.error(firstError ?? 'Please fill all required fields');
    },
    [message]
  );

  if (!formId) return <div>Invalid form link.</div>;
  if (isLoading) return <div>Loading form...</div>;
  if (error || !formData) return <div>Failed to load form.</div>;
  if (showSuccess) return <SuccessStep />;

  return (
    <div className='min-h-screen bg-white'>
      <div className='max-w-md mx-auto min-h-screen'>
        <DynamicReviewForm
          form={form}
          questions={formData.questions}
          formTitle={formData.title}
          onSubmit={handleSubmit}
          onFinishFailed={handleFinishFailed}
          loading={false}
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
