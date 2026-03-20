'use client';

import { App, Button, Input, Modal } from 'antd';
import { useCallback, useState } from 'react';

const MAX_COMPLAINT_LENGTH = 4000;

export type ComplaintModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export function ComplaintModal({
  open,
  onClose,
  onSubmit,
}: ComplaintModalProps) {
  const { message } = App.useApp();
  const [complaintReason, setComplaintReason] = useState('');

  const handleClose = useCallback(() => {
    setComplaintReason('');
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
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
    onSubmit(trimmed);
    handleClose();
  }, [complaintReason, onSubmit, message, handleClose]);

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
          disabled={!complaintReason.trim()}
          className="font-['Epilogue']! text-gray-700! font-medium h-14 rounded-2xl text-lg border-none! transition-all bg-[#3DCA84]! hover:bg-[#34b375]! hover:text-[#1C2B25]! active:scale-[0.98]!"
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
          rows={8}
          className="font-['Epilogue'] rounded-xl bg-[#F1F5F3] border-none focus:ring-2 focus:ring-[#3DCA84] text-base"
        />
      </div>
    </Modal>
  );
}
