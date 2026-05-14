'use client';

import { useState, useCallback } from 'react';
import { Input, message } from 'antd';
import { User, Phone } from 'lucide-react';
import Button from '@/components/common/Button';
import { buildWhatsAppUrl, openWhatsAppUrl } from '@/lib/utils/whatsapp';
import { OtpStep } from '@/components/review/OtpStep';
import { authApi } from '@/lib/services/api/auth.api';
import { normalizeToE164IndianPhone } from '@/lib/utils/phone';

const QUOTE_USER_DETAILS_STORAGE_KEY = 'quoteUserDetails';

export interface StoredQuoteUserDetails {
  name: string;
  phone: string;
}

export function loadStoredQuoteUserDetails(): Partial<StoredQuoteUserDetails> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(QUOTE_USER_DETAILS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<StoredQuoteUserDetails>;
  } catch {
    return {};
  }
}

function saveStoredQuoteDetails(details: StoredQuoteUserDetails) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      QUOTE_USER_DETAILS_STORAGE_KEY,
      JSON.stringify(details)
    );
  } catch {
    // ignore
  }
}

function clearStoredQuoteDetails() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(QUOTE_USER_DETAILS_STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: StoredQuoteUserDetails) => Promise<string>;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

function getInitialFormState(): {
  name: string;
  phone: string;
} {
  const stored = loadStoredQuoteUserDetails();
  return {
    name: stored.name ?? '',
    phone: stored.phone ?? '',
  };
}

function getApiErrorInfo(error: unknown): {
  status?: number;
  message?: string;
} {
  if (error == null || typeof error !== 'object') return {};
  return {
    status:
      'status' in error ? (error as { status?: number }).status : undefined,
    message:
      'message' in error
        ? String((error as { message?: string }).message)
        : undefined,
  };
}

export const QuoteModal = ({ isOpen, onClose, onConfirm }: QuoteModalProps) => {
  const [form, setForm] = useState(getInitialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const { name, phone } = form;
  const setName = useCallback(
    (value: string) => setForm((f) => ({ ...f, name: value })),
    []
  );
  const setPhone = useCallback(
    (value: string) => setForm((f) => ({ ...f, phone: value })),
    []
  );

  const validate = useCallback((): boolean => {
    if (!name.trim()) {
      message.error('Name is required');
      return false;
    }
    if (!phone.trim()) {
      message.error('Phone number is required');
      return false;
    }
    if (!isValidPhone(phone)) {
      message.error('Enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  }, [name, phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isRequestingOtp) return;
    if (!validate()) return;

    const phoneNumber = normalizeToE164IndianPhone(phone);
    if (!phoneNumber) {
      message.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsRequestingOtp(true);
    try {
      await authApi.requestOtp({
        phoneNumber,
      });
      setOtpModalOpen(true);
    } catch (err) {
      const { status, message: apiMessage } = getApiErrorInfo(err);
      if (status === 400) {
        message.error(
          'Invalid phone number. Please enter a valid number in +91 format.'
        );
      } else if (status === 500) {
        message.error('Unable to send OTP right now. Please try again.');
      } else {
        message.error(apiMessage ?? 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleOtpVerify = async () => {
    if (!otp || otp.length !== 4) {
      message.error('Please enter the 4-digit verification code');
      return;
    }

    const phoneNumber = normalizeToE164IndianPhone(phone);
    if (!phoneNumber) {
      message.error('Invalid phone number.');
      return;
    }

    setIsVerifyingOtp(true);
    setIsSubmitting(true);
    try {
      // 1. Verify OTP
      await authApi.verifyOtp({
        phoneNumber,
        otp,
        name: name.trim(),
      });

      // 2. Proceed with confirmation
      const details = {
        name: name.trim(),
        phone: phone.trim(),
      };
      saveStoredQuoteDetails(details);

      const messageText = await onConfirm(details);
      const whatsappUrl = buildWhatsAppUrl('917204094741', messageText);

      setOtpModalOpen(false);
      setOtp('');
      openWhatsAppUrl(whatsappUrl, undefined, false);
      handleClose();
    } catch (err) {
      const { status, message: apiMessage } = getApiErrorInfo(err);
      if (status === 400) {
        message.error('Invalid phone number. Please request OTP again.');
      } else if (status === 401) {
        message.error('Invalid OTP. Please try again.');
      } else {
        message.error(
          apiMessage ?? 'Failed to submit quote. Please try again.'
        );
      }
    } finally {
      setIsVerifyingOtp(false);
      setIsSubmitting(false);
    }
  };

  const handleOtpResend = async () => {
    if (isResendingOtp || isRequestingOtp) return;
    const phoneNumber = normalizeToE164IndianPhone(phone);
    if (!phoneNumber) {
      message.error('Invalid phone number. Please go back and re-enter it.');
      return;
    }

    setIsResendingOtp(true);
    try {
      await authApi.requestOtp({ phoneNumber });
      message.success('OTP resent successfully.');
    } catch (err) {
      const { status, message: apiMessage } = getApiErrorInfo(err);
      if (status === 400) {
        message.error(
          'Invalid phone number. Please enter a valid number in +91 format.'
        );
      } else if (status === 500) {
        message.error('Unable to resend OTP right now. Please try again.');
      } else {
        message.error(apiMessage ?? 'Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', phone: '' });
    clearStoredQuoteDetails();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm transition-all duration-300'
      role='dialog'
      aria-modal='true'
      onClick={handleClose}
    >
      <div
        className='relative w-full bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[70vh] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='shrink-0 pt-3 pb-2 px-5'>
          <div
            className='mx-auto w-10 h-1 rounded-full bg-gray-300'
            aria-hidden
          />
        </div>

        <div className='flex-1 overflow-y-auto px-5 pb-5'>
          <div className='text-center mb-6'>
            <h2 className='text-xl font-bold text-[#5D4037] mb-2'>
              Get a Quote
            </h2>
            <p className='text-gray-500 text-sm'>
              Please provide your details to proceed
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Full Name
              </label>
              <Input
                prefix={<User size={18} className='text-gray-400' />}
                placeholder='Enter your full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='rounded-lg h-12'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Phone Number
              </label>
              <Input
                prefix={<Phone size={18} className='text-gray-400' />}
                placeholder='Enter your phone number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='rounded-lg h-12'
                type='tel'
                inputMode='numeric'
              />
            </div>

            <div className='pt-4'>
              <Button
                fullWidth
                size='large'
                className='h-12 text-lg shadow-lg border-none'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Get Quote'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <OtpStep
        open={otpModalOpen}
        onClose={() => {
          setOtpModalOpen(false);
          setOtp('');
        }}
        otp={otp}
        onOtpChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 4))}
        phoneNumber={phone}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        verifyLoading={isVerifyingOtp}
        resendLoading={isResendingOtp}
      />
    </div>
  );
};
