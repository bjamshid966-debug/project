import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/supabase';
import type { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (loginId: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('admin_session');
    if (stored) {
      try {
        const { admin: storedAdmin, session } = JSON.parse(stored);
        if (session && storedAdmin) {
          supabase.auth.setSession(session).then(({ error }) => {
            if (!error) {
              setAdmin(storedAdmin);
            } else {
              localStorage.removeItem('admin_session');
            }
            setIsLoading(false);
          });
          return;
        }
      } catch {
        localStorage.removeItem('admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (loginId: string, password: string): Promise<{ error?: string }> => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ login_id: loginId, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { error: data.error || 'Login xatosi' };
      }

      await supabase.auth.setSession(data.session);
      setAdmin(data.admin);
      localStorage.setItem('admin_session', JSON.stringify({
        admin: data.admin,
        session: data.session,
      }));

      return {};
    } catch {
      return { error: 'Server bilan ulanishda xato' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    localStorage.removeItem('admin_session');
  };

  return <AuthContext.Provider value={{ admin, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
