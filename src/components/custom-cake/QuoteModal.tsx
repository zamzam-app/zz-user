'use client';

import { useState, useCallback } from 'react';
import { Input, message } from 'antd';
import { User, Phone } from 'lucide-react';
import Button from '@/components/common/Button';
import { buildWhatsAppUrl, openWhatsAppUrl } from '@/lib/utils/whatsapp';

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
  onConfirm: (details: StoredQuoteUserDetails) => string;
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

export const QuoteModal = ({ isOpen, onClose, onConfirm }: QuoteModalProps) => {
  const [form, setForm] = useState(getInitialFormState);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const details = {
      name: name.trim(),
      phone: phone.trim(),
    };
    saveStoredQuoteDetails(details);
    const message = onConfirm(details);
    const whatsappUrl = buildWhatsAppUrl('917204094741', message);
    openWhatsAppUrl(whatsappUrl, undefined, false);
    handleClose();
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
              />
            </div>

            <div className='pt-4'>
              <Button
                fullWidth
                size='large'
                className='h-12 text-lg shadow-lg border-none'
              >
                Get Quote
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
