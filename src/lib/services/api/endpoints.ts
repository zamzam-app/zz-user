export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  requestOtp: '/auth/request-otp',
  verifyOtp: '/auth/verify-otp',
};

export const formEndpoints = {
  getById: (id: string) => `/forms/${id}`,
};

export const outletEndpoints = {
  getByQrToken: (qrToken: string) => `/outlet/by-qr/${qrToken}`,
};

export const reviewEndpoints = {
  list: '/review',
  create: '/review',
  submitWithOtp: '/review/submit-with-otp',
};
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};

export const UPLOAD = {
  SIGNATURE: '/upload/signature',
};

export const uploadedCakesEndpoints = {
  create: '/uploaded-cakes',
};
