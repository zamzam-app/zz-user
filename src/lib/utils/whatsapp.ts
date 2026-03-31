export const buildWhatsAppUrl = (phone: string, text: string) => {
  const normalizedPhone = phone.replace(/[^\d]/g, '');
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
};

export const preopenWhatsAppWindow = (): Window | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.open('', '_blank', 'noopener,noreferrer');
  } catch {
    return null;
  }
};

export const openWhatsAppUrl = (url: string, preopened?: Window | null) => {
  if (typeof window === 'undefined') return;

  if (preopened && !preopened.closed) {
    try {
      preopened.location.href = url;
      preopened.focus?.();
      return;
    } catch {
      // fall through to normal open
    }
  }

  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (!newWindow) {
    window.location.href = url;
  }
};
