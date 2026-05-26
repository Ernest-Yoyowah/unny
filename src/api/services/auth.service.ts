import { MOCK_ACCOUNTS, createDemoStudent } from "../../data/mock";
import {
  LoginCredentials,
  RegisterPayload,
  AuthResponse,
} from "../../types/auth.types";

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 600));
    const match = MOCK_ACCOUNTS.find(
      (a) =>
        a.email.toLowerCase() === credentials.email.toLowerCase() &&
        a.password === credentials.password,
    );
    if (match) return match.response;
    const rawName = credentials.email.split("@")[0];
    const fullName = rawName
      .split(/[._-]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return createDemoStudent(credentials.email, fullName);
  },

  register: async (
    payload: Omit<RegisterPayload, "confirmPassword">,
  ): Promise<AuthResponse> => {
    await new Promise((r) => setTimeout(r, 800));
    const match = MOCK_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === payload.email.toLowerCase(),
    );
    if (match) return match.response;
    return createDemoStudent(payload.email, payload.fullName);
  },

  logout: async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 200));
  },

  forgotPassword: async (_email: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
  },

  resetPassword: async (_token: string, _password: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
  },

  verifyEmail: async (_token: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 500));
  },
};
