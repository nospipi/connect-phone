// src/storage.ts
// This module handles token storage that works on both web and React Native

// Define the storage interface
export interface TokenStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Constants for storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_access_token",
  REFRESH_TOKEN: "auth_refresh_token",
};

// Create a storage provider factory
export const createTokenStorage = (storage: TokenStorage) => {
  // Store tokens
  const saveTokens = async (accessToken: string, refreshToken: string) => {
    await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  };

  // Get stored tokens
  const getTokens = async () => {
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return { accessToken, refreshToken };
  };

  // Clear tokens (for logout)
  const clearTokens = async () => {
    await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  };

  return {
    saveTokens,
    getTokens,
    clearTokens,
  };
};

export type TokenStorageProvider = ReturnType<typeof createTokenStorage>;
