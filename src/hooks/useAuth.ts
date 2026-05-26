import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "../api/services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { LoginCredentials, RegisterPayload } from "../types/auth.types";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.login(credentials),
    onSuccess: async ({ user, tokens }) => {
      await setAuth(user, tokens);
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (payload: RegisterPayload) => {
      const { confirmPassword: _, ...rest } = payload;
      return AuthService.register(rest);
    },
    onSuccess: async ({ user, tokens }) => {
      await setAuth(user, tokens);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AuthService.logout,
    onSettled: async () => {
      await clearAuth();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (email: string) => AuthService.forgotPassword(email),
  });
