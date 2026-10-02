"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);

        // Verify token in background
        api.auth
          .me()
          .then((res) => {
            if (res.success && res.user) {
              const freshUser: User = {
                id: res.user._id || res.user.id,
                name: res.user.name,
                email: res.user.email,
                role: res.user.role,
              };
              setUser(freshUser);
              localStorage.setItem("user", JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            // Token might be expired, but we keep cached state unless 401
          });
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.token && res.user) {
        const loggedUser: User = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        };

        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));

        setToken(res.token);
        setUser(loggedUser);

        return { success: true };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err: any) {
      return { success: false, message: err.message || "Unable to connect to server" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.auth.register({ name, email, password });
      if (res.success) {
        if (res.token && res.user) {
          const newUser: User = {
            id: res.user.id || res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: res.user.role,
          };
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(newUser));
          setToken(res.token);
          setUser(newUser);
        }
        return { success: true };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (err: any) {
      return { success: false, message: err.message || "Unable to connect to server" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      if (res.success && res.user) {
        const freshUser: User = {
          id: res.user._id || res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        };
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      }
    } catch (e) {
      console.error("Refresh user failed", e);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem("user", JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        isStudent: user?.role === "student",
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
