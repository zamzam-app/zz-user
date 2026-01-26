const ACCESS_TOKEN_KEY = 'accessToken';

export const cookieService = {
  setAccessToken(token: string) {
    document.cookie = `${ACCESS_TOKEN_KEY}=${token}; path=/`;
  },

  getAccessToken(): string | null {
    if (typeof document === 'undefined') return null;

    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${ACCESS_TOKEN_KEY}=`));

    return match ? match.split('=')[1] : null;
  },

  removeAccessToken() {
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};
