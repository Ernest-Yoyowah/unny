import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { User } from "../types/user.types";
import { AuthTokens } from "../types/auth.types";
import { SECURE_STORE_KEYS } from "../api/client";

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAuth: (user: User, tokens: AuthTokens) => Promise<void>;
  clearAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: async (user, tokens) => {
    await Promise.all([
      SecureStore.setItemAsync(
        SECURE_STORE_KEYS.ACCESS_TOKEN,
        tokens.accessToken,
      ),
      SecureStore.setItemAsync(
        SECURE_STORE_KEYS.REFRESH_TOKEN,
        tokens.refreshToken,
      ),
      SecureStore.setItemAsync(
        SECURE_STORE_KEYS.USER_DATA,
        JSON.stringify(user),
      ),
    ]);
    set({ user, tokens, isAuthenticated: true });
  },

  clearAuth: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_DATA),
    ]);
    set({ user: null, tokens: null, isAuthenticated: false });
  },

  initializeAuth: async () => {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        SecureStore.getItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(SECURE_STORE_KEYS.USER_DATA),
      ]);

      if (accessToken && refreshToken && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          user,
          tokens: { accessToken, refreshToken, expiresAt: 0 },
          isAuthenticated: true,
        });
      }
    } finally {
      set({ isInitializing: false });
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    set({ user: updated });
    SecureStore.setItemAsync(
      SECURE_STORE_KEYS.USER_DATA,
      JSON.stringify(updated),
    );
  },
}));
