"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthState {
  email: string | null;
  isAuthed: boolean;
  signIn: (email: string) => void;   // called after a successful /auth/login
  signOut: () => void;
}

const AuthCtx = createContext<AuthState | null>(null);

const STORAGE_KEY = "freshcart.session.email";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    try { setEmail(localStorage.getItem(STORAGE_KEY)); } catch {}
  }, []);

  function signIn(em: string) {
    setEmail(em);
    try { localStorage.setItem(STORAGE_KEY, em); } catch {}
  }

  function signOut() {
    setEmail(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return (
    <AuthCtx.Provider value={{ email, isAuthed: !!email, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
