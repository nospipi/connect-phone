// src/hooks.ts
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from './types';
import { AuthApi } from './api';
import { TokenStorageProvider } from './storage';

// Auth context props
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  requestOtp: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Default context values
const defaultContext: AuthContextProps = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  requestOtp: async () => false,
  verifyOtp: async () => false,
  logout: async () => {},
};

// Create the context
const AuthContext = createContext<AuthContextProps>(defaultContext);

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode;
  api: AuthApi;
  storage: TokenStorageProvider;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  api,
  storage,
}) => {
  // State
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get stored tokens
        const { accessToken, refreshToken } = await storage.getTokens();
        
        if (!accessToken) {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Try to get user profile
        try {
          const user = await api.getProfile(accessToken);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // If access token expired, try refreshing
          if (refreshToken) {
            try {
              const tokens = await api.refreshTokens(refreshToken);
              await storage.saveTokens(tokens.accessToken, tokens.refreshToken);
              
              const user = await api.getProfile(tokens.accessToken);
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } catch (refreshError) {
              // Refresh failed, clear tokens
              await storage.clearTokens();
              setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Session expired',
              });
            }
          } else {
            // No refresh token, clear everything
            await storage.clearTokens();
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Authentication initialization failed',
        }));
      }
    };

    initAuth();
  }, []);

  // Request OTP
  const requestOtp = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await api.requestOtp(email);
      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send verification code',
      }));
      return false;
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await api.verifyOtp(email, otp);
      
      // Save tokens
      await storage.saveTokens(result.accessToken, result.refreshToken);
      
      // Update state
      setState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid verification code',
      }));
      return false;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { refreshToken } = await storage.getTokens();
      if (refreshToken) {
        await api.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.clearTokens();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        error: state.error,
        requestOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};