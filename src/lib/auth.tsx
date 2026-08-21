import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cartlift.session";
const DEMO_EMAIL = "emerson@cartlift.com";
const DEMO_PASSWORD = "08061980";

type AuthState = {
  ready: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      setAuthenticated(window.localStorage.getItem(STORAGE_KEY) === "active");
    } catch {
      setAuthenticated(false);
    }
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (normalized !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return { ok: false, error: "E-mail ou senha incorretos. Verifique e tente novamente." };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, "active");
    } catch {
      /* ignore */
    }
    setAuthenticated(true);
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({ ready, isAuthenticated, signIn, signOut }),
    [ready, isAuthenticated, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
