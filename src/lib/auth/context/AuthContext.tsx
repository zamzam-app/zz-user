'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { cookieService } from '@/lib/services/cookie.service';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authApi } from '@/lib/services/api/auth.api';
import { storage } from '@/lib/services/storage';

type AuthState = {
  user: User | null;
  isHydrating: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATE_START' }
  | { type: 'HYDRATE_COMPLETE' };

type AuthContextType = {
  user: User | null;
  hydrateUser: () => void;
  isHydrating: boolean;
  logout: () => void;
};

const initialState: AuthState = {
  user: null,
  isHydrating: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE_START':
      return { ...state, isHydrating: true };
    case 'HYDRATE_COMPLETE':
      return { ...state, isHydrating: false };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  const hydratedRef = useRef(false);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    cookieService.removeAccessToken();
    storage.removeUser();
    storage.removeToken();
    dispatch({ type: 'LOGOUT' });
    router.replace('/');
  }, [router]);

  const hydrateUser = useCallback(async () => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    dispatch({ type: 'HYDRATE_START' });

    try {
      const user: User | null = storage.getUser();

      // if (!user || !user.id) {
      //   const freshUser = await authApi.getProfile();
      //   console.log('got a fresh user', freshUser);
      //   storage.setUser(freshUser);
      //   dispatch({ type: 'LOGIN', payload: freshUser });
      //   return;
      // }

      if (!user) {
        dispatch({ type: 'HYDRATE_COMPLETE' });
        return;
      }

      dispatch({ type: 'LOGIN', payload: user as User });
    } catch {
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'HYDRATE_COMPLETE' });
    }
  }, []);

  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isHydrating: state.isHydrating,
        hydrateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
