const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const storage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  setUser: (user: unknown) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: <User>(): User | null => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user) as User;
    } catch {
      return null;
    }
  },
  removeUser: () => localStorage.removeItem(USER_KEY),

  clear: () => localStorage.clear(),
};
