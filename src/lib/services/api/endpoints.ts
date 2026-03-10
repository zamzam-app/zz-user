export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  verifyOtp: '/auth/verify-otp',
};

export const formEndpoints = {
  getById: (id: string) => `/forms/${id}`,
};

export const outletEndpoints = {
  getByQrToken: (qrToken: string) => `/outlet/by-qr/${qrToken}`,
};

export const reviewEndpoints = {
  create: '/review',
};
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};

export const UPLOAD = {
  SIGNATURE: '/upload/signature',
};
