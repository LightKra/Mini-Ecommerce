import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../lib/services";
import type { LoginRequest, RegisterRequest } from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook for user registration
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      authService.saveTokens(response.accessToken, response.refreshToken);
      queryClient.setQueryData(queryKeys.auth.user(), response.user);
    },
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      authService.saveTokens(response.accessToken, response.refreshToken);
      queryClient.setQueryData(queryKeys.auth.user(), response.user);
    },
  });
}

/**
 * Hook for user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        return Promise.resolve();
      }
      return authService.logout(refreshToken);
    },
    onSuccess: () => {
      authService.clearTokens();
      queryClient.clear();
    },
    onError: () => {
      // Clear tokens even on error
      authService.clearTokens();
      queryClient.clear();
    },
  });
}

/**
 * Hook for token refresh
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: () => {
      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(new Error("No refresh token available"));
      }
      return authService.refresh(refreshToken);
    },
    onSuccess: (response) => {
      authService.saveTokens(response.accessToken, response.refreshToken);
    },
  });
}
