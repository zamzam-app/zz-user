export const authEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
};
export const productEndpoints = {
  getAll: '/product',
  getById: (id: string) => `/product/${id}`,
};
