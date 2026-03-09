'use client';

import type { FormInstance } from 'antd';
import { App, Button, Input, Modal } from 'antd';
import { useCallback, useState } from 'react';
import type { CreateReviewDto, UserResponse } from '@/types/review';
import type { FormData, FormQuestion } from '@/types/form';

const MAX_COMPLAINT_LENGTH = 4000;

const activeQuestions = (questions: FormQuestion[]) =>
  questions.filter((q) => q.isActive && !q.isDeleted);

function buildResponseFromFormValues(
  values: Record<string, unknown>,
  formData: FormData
): UserResponse[] {
  const answers = (values.answers as Record<string, unknown>) ?? {};
  const questions = activeQuestions(formData.questions);
  return questions.map((q) => ({
    questionId: q._id,
    answer:
      (answers[q._id] as string | string[] | number) ??
      (q.type === 'checkbox' ? [] : q.type === 'rating' ? 0 : ''),
  }));
}

export type ComplaintModalProps = {
  open: boolean;
  onClose: () => void;
  formId: string;
  outletId: string;
  form: FormInstance;
  formData: FormData;
  userId?: string;
  onSubmit: (payload: CreateReviewDto) => void | Promise<void>;
};

export function ComplaintModal({
  open,
  onClose,
  formId,
  outletId,
  form,
  formData,
  userId,
  onSubmit,
}: ComplaintModalProps) {
  const { message } = App.useApp();
  const [complaintReason, setComplaintReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setComplaintReason('');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    const trimmed = complaintReason.trim();
    if (!trimmed) {
      message.warning('Please describe your complaint.');
      return;
    }
    if (trimmed.length > MAX_COMPLAINT_LENGTH) {
      message.warning(
        `Complaint must be at most ${MAX_COMPLAINT_LENGTH} characters.`
      );
      return;
    }
    setSubmitting(true);
    try {
      const values = form.getFieldsValue();
      const response = buildResponseFromFormValues(values, formData);
      const payload: CreateReviewDto = {
        formId,
        outletId,
        response,
        isComplaint: true,
        complaintReason: trimmed,
      };
      if (userId) payload.userId = userId;
      await onSubmit(payload);
      handleClose();
    } catch {
      // Parent typically shows error toast
    } finally {
      setSubmitting(false);
    }
  }, [
    complaintReason,
    form,
    formData,
    formId,
    outletId,
    userId,
    onSubmit,
    message,
    handleClose,
  ]);

  return (
    <Modal
      title='Raise a complaint'
      open={open}
      onCancel={handleClose}
      closable
      footer={
        <Button
          type='primary'
          onClick={handleSubmit}
          loading={submitting}
          disabled={!complaintReason.trim()}
          className="font-['Epilogue']"
        >
          Submit
        </Button>
      }
      width='min(100vw - 32px, 520px)'
      styles={{
        body: { maxHeight: '70vh', overflow: 'auto' },
      }}
      className='complaint-modal'
    >
      <div className='space-y-2'>
        <Input.TextArea
          placeholder='Describe your complaint...'
          value={complaintReason}
          onChange={(e) =>
            setComplaintReason(e.target.value.slice(0, MAX_COMPLAINT_LENGTH))
          }
          maxLength={MAX_COMPLAINT_LENGTH}
          showCount
          rows={8}
          className="font-['Epilogue'] rounded-xl bg-[#F1F5F3] border-none focus:ring-2 focus:ring-[#3DCA84]"
        />
      </div>
    </Modal>
  );
}
