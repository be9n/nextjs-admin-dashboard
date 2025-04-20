"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import authAxios from "../lib/authAxios";
import { removeAccessToken, setAccessTokenCookie } from "@/actions/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      fetchUser();
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchUser = async () => {
    const { data } = await authAxios.get("/me");
    
    setAuthState((prev) => ({
      ...prev,
      user: data.data.user,
      isAuthenticated: true,
      isLoading: false,
    }));
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await authAxios.post(`/login`, credentials);
      const { user, access_token: accessToken } = data.data;
      console.log(data);
      
      await setAccessTokenCookie(accessToken);

      setAuthState({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await authAxios.post(`/register`, credentials);
      const { user, access_token: accessToken } = response.data;

      await setAccessTokenCookie(accessToken);

      setAuthState({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await authAxios.get(`/logout`);

    await removeAccessToken();

    redirect("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
