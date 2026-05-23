"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ADMIN_CREDENTIALS, STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, removeStorageItem, setStorageItem } from "@/utils/storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStorageItem<{ user: string }>(STORAGE_KEYS.session);
    setIsAuthenticated(!!session);
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      setStorageItem(STORAGE_KEYS.session, { user: username });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.session);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
