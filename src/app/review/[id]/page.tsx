'use client';

import { useQuery } from '@tanstack/react-query';
import { App, Form } from 'antd';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DynamicReviewForm } from '@/components/review/DynamicReviewForm';
import { OtpStep } from '@/components/review/OtpStep';
import { SuccessStep } from '@/components/review/SuccessStep';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { cookieService } from '@/lib/services/cookie.service';
import { storage } from '@/lib/services/storage';
import { outletApi } from '@/lib/services/api/outlet.api';
import { reviewApi } from '@/lib/services/api/review.api';
import { authApi } from '@/lib/services/api/auth.api';
import type { CreateReviewDto, UserResponse } from '@/types/review';
import type { FormData, FormQuestion } from '@/types/form';

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

function toDobIso(dob: unknown): string | undefined {
  if (dob == null) return undefined;
  const d = dob as { format?: (f: string) => string };
  if (typeof d.format === 'function') return d.format('YYYY-MM-DD');
  if (typeof dob === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(dob)) return dob;
    const parts = dob.split(/[/-]/);
    if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2)
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return undefined;
}

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
  const qrToken = params?.id as string;

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
  const [complaintReason, setComplaintReason] = useState<string | null>(null);

  const {
    data: outletData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['outletByQr', qrToken],
    queryFn: () => outletApi.getByQrToken(qrToken),
    enabled: !!qrToken,
  });

  const formData = useMemo(
    () =>
      outletData?.form != null
        ? { ...outletData.form, outletId: outletData._id }
        : null,
    [outletData]
  );

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
      const nameTrimmed =
        typeof pendingValues.name === 'string' ? pendingValues.name.trim() : '';
      const emailTrimmed =
        typeof pendingValues.email === 'string'
          ? pendingValues.email.trim()
          : '';
      const dobIso = toDobIso(pendingValues.dob);
      const authResponse = await authApi.verifyOtp({
        phoneNumber,
        otp,
        ...(nameTrimmed && { name: nameTrimmed }),
        ...(emailTrimmed && { email: emailTrimmed }),
        ...(dobIso && { dob: dobIso }),
      });
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

    const outletId = fd.outletId ?? searchParams.get('outletId') ?? fd._id;
    const payload = buildCreateReviewPayload(
      fd._id,
      outletId,
      userId ?? undefined,
      values,
      fd
    );
    if (complaintReason?.trim()) {
      payload.isComplaint = true;
      payload.complaintReason = complaintReason.trim();
    }
    setSubmitting(true);
    reviewApi
      .create(payload)
      .then((res) => {
        setComplaintReason(null);
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
  }, [
    contextUserId,
    pendingRatingSubmit,
    searchParams,
    message,
    complaintReason,
  ]);

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

  const handleComplaintSubmit = useCallback((reason: string) => {
    setComplaintReason(reason);
  }, []);

  if (!qrToken) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <p className='text-gray-500'>Invalid link.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-gray-500'>Loading...</div>
      </div>
    );
  }

  if (error || !outletData) {
    const is404 =
      error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as { status?: number }).status === 404;
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-6'>
        <p className='text-gray-500 text-center'>
          {is404
            ? 'Invalid or expired link.'
            : error && typeof error === 'object' && 'message' in error
              ? String((error as { message: string }).message)
              : 'Failed to load. Please try again later.'}
        </p>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center px-6'>
        <p className='text-gray-500 text-center'>
          This outlet has no feedback form.
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
        {(outletData.name || outletData.table) && (
          <div className='px-6 pt-4 text-center text-sm text-gray-500'>
            {outletData.name && <span>{outletData.name}</span>}
            {outletData.table && (
              <span>
                {outletData.name ? ' · ' : ''}
                Table: {outletData.table.name}
              </span>
            )}
          </div>
        )}
        <DynamicReviewForm
          form={form}
          questions={formData.questions}
          formTitle={formData.title}
          onSubmit={handleSubmit}
          onFinishFailed={handleFinishFailed}
          onComplaintSubmit={handleComplaintSubmit}
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
