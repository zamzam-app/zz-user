'use client';

import { useQuery } from '@tanstack/react-query';
import { App, Form } from 'antd';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DynamicReviewForm } from '@/components/review/DynamicReviewForm';
import { OtpStep } from '@/components/review/OtpStep';
import { SuccessStep } from '@/components/review/SuccessStep';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { cookieService } from '@/lib/services/cookie.service';
import { storage } from '@/lib/services/storage';
import { formApi } from '@/lib/services/api/form.api';
import { reviewApi } from '@/lib/services/api/review.api';
import { authApi } from '@/lib/services/api/auth.api';
import type { CreateReviewDto, UserResponse } from '@/types/review';
import type { FormData, FormQuestion } from '@/types/form';

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

function buildCreateReviewPayload(
  formId: string,
  outletId: string,
  userId: string | undefined,
  values: Record<string, unknown>,
  formData: FormData
): CreateReviewDto {
  const answers = (values.answers as Record<string, unknown>) ?? {};
  const questions = activeQuestions(formData.questions);
  const response: UserResponse[] = questions.map((q) => ({
    questionId: q._id,
    answer:
      (answers[q._id] as string | string[] | number) ??
      (q.type === 'checkbox' ? [] : q.type === 'rating' ? 0 : ''),
  }));
  const payload: CreateReviewDto = {
    formId,
    outletId,
    response,
  };
  if (userId) payload.userId = userId;
  return payload;
}

export default function ReviewFormPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const { user, hydrateUser } = useAuth();
  const formId = params?.id as string;

  const [form] = Form.useForm();
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedRating, setSubmittedRating] = useState<number | undefined>();
  const [pendingValues, setPendingValues] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [pendingRatingSubmit, setPendingRatingSubmit] = useState<{
    values: Record<string, unknown>;
    formData: FormData;
    /** Set after OTP when we have the user from authResponse (context may not have updated yet). */
    userId?: string | null;
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

      const responseUserId =
        authResponse.user?.id ??
        (authResponse.user as { _id?: string })?._id ??
        null;
      setPendingRatingSubmit({
        values: pendingValues,
        formData,
        userId: responseUserId,
      });
      setOtpModalOpen(false);
      setOtp('');
      setPendingValues(null);
    } catch (err) {
      const status =
        err && typeof err === 'object' && 'status' in err
          ? (err as { status?: number }).status
          : undefined;
      const msg =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Failed to submit review. Please try again.';
      message.error(status === 401 ? 'Incorrect OTP' : msg);
    } finally {
      setSubmitting(false);
    }
  }, [otp, pendingValues, formData, hydrateUser, message]);

  const contextUserId =
    user?.id ?? (user as { _id?: string } | null)?._id ?? null;

  useEffect(() => {
    if (!pendingRatingSubmit) return;
    const { values, formData: fd, userId: pendingUserId } = pendingRatingSubmit;
    const userId = pendingUserId ?? contextUserId;
    if (!userId) return;

    setPendingRatingSubmit(null);

    const outletId = fd.outletId ?? searchParams.get('outletId') ?? formId;
    const payload = buildCreateReviewPayload(
      formId,
      outletId,
      userId ?? undefined,
      values,
      fd
    );
    setSubmitting(true);
    reviewApi
      .create(payload)
      .then((res) => {
        setSubmittedRating(res.overallRating);
        setShowSuccess(true);
      })
      .catch((err) => {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : 'Failed to submit review. Please try again.';
        message.error(msg);
      })
      .finally(() => setSubmitting(false));
  }, [contextUserId, pendingRatingSubmit, formId, searchParams, message]);

  const handleOtpResend = useCallback(() => {
    // TODO: call backend to resend OTP
    message.info('OTP resent');
  }, [message]);

  const handleFinishFailed = useCallback(
    (info: { errorFields: { errors: string[] }[] }) => {
      const firstError = info.errorFields?.[0]?.errors?.[0];
      message.error(firstError ?? 'Please fill all required fields');
    },
    [message]
  );

  const handleSubmitComplaint = useCallback(
    async (payload: Parameters<typeof reviewApi.create>[0]) => {
      try {
        await reviewApi.create(payload);
        message.success('Complaint submitted');
      } catch (err) {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : 'Failed to submit complaint. Please try again.';
        message.error(msg);
      }
    },
    [message]
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
          <SuccessStep rating={submittedRating} />
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
          formId={formId}
          outletId={formData.outletId ?? searchParams.get('outletId') ?? formId}
          formData={formData}
          userId={contextUserId ?? undefined}
          onSubmit={handleSubmit}
          onFinishFailed={handleFinishFailed}
          onSubmitComplaint={handleSubmitComplaint}
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
