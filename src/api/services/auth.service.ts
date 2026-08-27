import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import {
  LoginCredentials,
  RegisterPayload,
  AuthResponse,
} from "../../types/auth.types";
import { User } from "../../types/user.types";

interface ApiAuthResponse {
  data: {
    user: {
      id: string;
      email: string;
      role: string;
      profile?: {
        fullName?: string;
        avatarUrl?: string | null;
        department?: string | null;
        matricNumber?: string | null;
        level?: string | null;
      };
    };
    accessToken: string;
    refreshToken: string;
  };
}

const normalizeAuthResponse = (response: ApiAuthResponse): AuthResponse => {
  const profile = response.data.user.profile;
  const backendRole = response.data.user.role.toUpperCase();
  const role: User["role"] =
    backendRole === "SUPERVISOR"
      ? "lecturer"
      : (backendRole.toLowerCase() as User["role"]);
  const user: User = {
    id: response.data.user.id,
    email: response.data.user.email,
    fullName: profile?.fullName ?? response.data.user.email,
    role,
    avatarUrl: profile?.avatarUrl ?? undefined,
    organizationId: "",
    organizationName: "",
    departmentId: profile?.department ?? undefined,
    isVerified: false,
    joinedAt: "",
    lastActiveAt: "",
  };

  return {
    user,
    tokens: {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: 0,
    },
  };
};

export const AuthService = {
  me: async (): Promise<User> => {
    const { data } = await apiClient.get<{ data: User } | User>(
      Endpoints.auth.me,
    );
    return "data" in data ? data.data : data;
  },
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiAuthResponse>(
      Endpoints.auth.login,
      credentials,
    );
    return normalizeAuthResponse(data);
  },

  register: async (
    payload: Omit<RegisterPayload, "confirmPassword">,
  ): Promise<AuthResponse> => {
    const { fullName, email, password, role, department, matricNumber, level } =
      payload;
    const { data } = await apiClient.post<ApiAuthResponse>(
      Endpoints.auth.register,
      {
        fullName,
        email,
        password,
        role: role === "lecturer" ? "SUPERVISOR" : "STUDENT",
        department,
        ...(matricNumber ? { matricNumber } : {}),
        ...(level ? { level } : {}),
      },
    );
    return normalizeAuthResponse(data);
  },

  logout: async (): Promise<void> => {
    await apiClient.post(Endpoints.auth.logout);
  },

  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiAuthResponse>(
      Endpoints.auth.refresh,
      { refreshToken },
    );
    return normalizeAuthResponse(data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post(Endpoints.auth.forgotPassword, { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post(Endpoints.auth.resetPassword, { token, password });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post(Endpoints.auth.verifyEmail, { token });
  },
};
