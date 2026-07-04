"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authAPI } from "@/config/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  adminLogin: (data: any) => Promise<any>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  updateUserLocal: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from token on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("codeskill_token") : null;
    if (token) {
      authAPI
        .getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("codeskill_token");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (data: any) => {
    try {
      setError(null);
      const res = await authAPI.register(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("codeskill_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const loginUser = useCallback(async (data: any) => {
    try {
      setError(null);
      const res = await authAPI.login(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("codeskill_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);


  const adminLogin = useCallback(async (data: any) => {
    try {
      setError(null);
      const res = await authAPI.adminLogin(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("codeskill_token", res.data.token);
      }
      setUser(res.data.user);
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Admin login failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logoutUser = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("codeskill_token");
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: any) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser((prev) => (prev ? { ...prev, ...res.data.user } : prev));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Update failed");
    }
  }, []);

  const updateUserLocal = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register: registerUser,
        login: loginUser,
    adminLogin,
        logout: logoutUser,
        updateProfile,
        updateUserLocal,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default AuthContext;
