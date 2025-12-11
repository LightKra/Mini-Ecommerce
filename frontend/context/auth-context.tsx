"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/services";
import type { User } from "@/lib/services";
import { queryKeys } from "@/queries";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      // First check if there's a cached user
      const cachedUser = queryClient.getQueryData<User>(queryKeys.auth.user());
      if (cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
        return;
      }

      // If there's a token but no cached user, fetch the current user
      const token = authService.getAccessToken();
      if (token) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
          queryClient.setQueryData(queryKeys.auth.user(), currentUser);
        } catch {
          // Token is invalid or expired, clear it
          authService.clearTokens();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [queryClient]);

  const logout = useCallback(() => {
    authService.clearTokens();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
