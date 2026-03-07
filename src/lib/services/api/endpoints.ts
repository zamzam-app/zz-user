export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  verifyOtp: '/auth/verify-otp',
};

export const formEndpoints = {
  getById: (id: string) => `/forms/${id}`,
};

export const ratingEndpoints = {
  create: '/rating',
};
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};

export const UPLOAD = {
  SIGNATURE: '/upload/signature',
};
