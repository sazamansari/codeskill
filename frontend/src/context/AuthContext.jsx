import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const token = localStorage.getItem("codeskill_token");
    if (token) {
      authAPI
        .getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem("codeskill_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      setError(null);
      const res = await authAPI.register({ name, email, password });
      localStorage.setItem("codeskill_token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login({ email, password });
      localStorage.setItem("codeskill_token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("codeskill_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser((prev) => ({ ...prev, ...res.data.user }));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Update failed");
    }
  }, []);

  // Update local user state (for optimistic UI updates)
  const updateUserLocal = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, register, login, logout, updateProfile, updateUserLocal, isAuthenticated: !!user }}
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
