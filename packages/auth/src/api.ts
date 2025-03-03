// src/api.ts
import axios, { AxiosInstance } from "axios";
import { User, AuthTokens } from "./types";

// Create a factory function for auth API
export const createAuthApi = (baseURL: string) => {
  // Create axios instance
  const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request OTP
  const requestOtp = async (email: string) => {
    const response = await api.post("/auth/otp/request", { email });
    return response.data;
  };

  // Verify OTP and get tokens
  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> => {
    const response = await api.post("/auth/otp/verify", { email, otp });
    return response.data;
  };

  // Get user profile
  const getProfile = async (accessToken: string): Promise<User> => {
    const response = await api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  };

  // Refresh tokens
  const refreshTokens = async (refreshToken: string): Promise<AuthTokens> => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  };

  // Logout
  const logout = async (refreshToken: string): Promise<void> => {
    await api.post("/auth/logout", { refreshToken });
  };

  return {
    requestOtp,
    verifyOtp,
    getProfile,
    refreshTokens,
    logout,
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;
