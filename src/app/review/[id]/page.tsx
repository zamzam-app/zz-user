'use client';

import { useQuery } from '@tanstack/react-query';
import { App, Form } from 'antd';
import { useParams, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { DynamicReviewForm } from '@/components/review/DynamicReviewForm';
import { OtpStep } from '@/components/review/OtpStep';
import { SuccessStep } from '@/components/review/SuccessStep';
import { outletApi } from '@/lib/services/api/outlet.api';
import { reviewApi } from '@/lib/services/api/review.api';
import { authApi } from '@/lib/services/api/auth.api';
import type {
  CreateReviewDto,
  SubmitReviewWithOtpDto,
  UserResponse,
} from '@/types/review';
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
    async (values: Record<string, unknown>) => {
      const phone = String(values.phone ?? '').trim();
      if (!phone || phone.length !== 10) {
        message.error('Please enter a valid 10-digit phone number');
        return;
      }

      try {
        await authApi.requestOtp({
          phoneNumber: `+91${phone}`,
        });
      } catch (err) {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : 'Failed to send OTP. Please try again.';
        message.error(msg);
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
      const outletId =
        formData.outletId ?? searchParams.get('outletId') ?? formData._id;
      const reviewPayload = buildCreateReviewPayload(
        formData._id,
        outletId,
        undefined,
        pendingValues,
        formData
      );
      const payload: SubmitReviewWithOtpDto = {
        phoneNumber,
        otp,
        ...(nameTrimmed && { name: nameTrimmed }),
        ...(emailTrimmed && { email: emailTrimmed }),
        ...(dobIso && { dob: dobIso }),
        formId: reviewPayload.formId,
        outletId: reviewPayload.outletId,
        response: reviewPayload.response,
        ...(complaintReason?.trim() && {
          isComplaint: true,
          complaintReason: complaintReason.trim(),
        }),
      };
      const res = await reviewApi.submitWithOtp(payload);
      setComplaintReason(null);
      setSubmittedRating(res.overallRating);
      setOtpModalOpen(false);
      setOtp('');
      setPendingValues(null);
      setShowSuccess(true);
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
  }, [otp, pendingValues, formData, searchParams, complaintReason, message]);

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
        <DynamicReviewForm
          form={form}
          questions={formData.questions}
          outletName={outletData.name}
          outletAddress={outletData.address}
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
