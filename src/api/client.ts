import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const configuredBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://unny-backend-reviced-prototype.onrender.com";
const BASE_URL = /\/api\/v1\/?$/.test(configuredBaseUrl)
  ? configuredBaseUrl.replace(/\/$/, "")
  : `${configuredBaseUrl.replace(/\/$/, "")}/api/v1`;
const REQUEST_TIMEOUT = 15000;
let refreshRequest: Promise<string | null> | null = null;
let authExpiredHandler: (() => void) | undefined;

export const setAuthExpiredHandler = (handler: () => void) => {
  authExpiredHandler = handler;
};

export const SECURE_STORE_KEYS = {
  ACCESS_TOKEN: "unny_access_token",
  REFRESH_TOKEN: "unny_refresh_token",
  USER_DATA: "unny_user_data",
} as const;

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(
      SECURE_STORE_KEYS.ACCESS_TOKEN,
    );
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;
      const refreshToken = await SecureStore.getItemAsync(
        SECURE_STORE_KEYS.REFRESH_TOKEN,
      );
      const requestUrl = originalRequest?.url ?? "";
      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/refresh");

      if (
        refreshToken &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthRequest
      ) {
        originalRequest._retry = true;
        refreshRequest ??= axios
          .post<{
            data?: { accessToken?: string; refreshToken?: string };
            accessToken?: string;
            refreshToken?: string;
          }>(`${BASE_URL}/auth/refresh`, { refreshToken })
          .then(async ({ data }) => {
            const nextAccessToken = data.data?.accessToken ?? data.accessToken;
            if (!nextAccessToken) return null;
            await SecureStore.setItemAsync(
              SECURE_STORE_KEYS.ACCESS_TOKEN,
              nextAccessToken,
            );
            const nextRefreshToken =
              data.data?.refreshToken ?? data.refreshToken;
            if (nextRefreshToken) {
              await SecureStore.setItemAsync(
                SECURE_STORE_KEYS.REFRESH_TOKEN,
                nextRefreshToken,
              );
            }
            return nextAccessToken;
          })
          .catch(() => null)
          .finally(() => {
            refreshRequest = null;
          });
        const nextAccessToken = await refreshRequest;
        if (nextAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
          return apiClient(originalRequest);
        }
      }

      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_DATA);
      authExpiredHandler?.();
    }
    return Promise.reject(error);
  },
);

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

export const extractApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | Record<string, unknown>
      | string
      | undefined;
    const message =
      typeof data === "string"
        ? data
        : (data?.message ?? (data?.errors as string[] | undefined)?.join(" "));
    return {
      message:
        typeof message === "string"
          ? message
          : error.message || "Unable to complete the request.",
      code:
        typeof data === "object" && data
          ? (data.code as string | undefined)
          : undefined,
      statusCode: error.response?.status,
    };
  }
  return {
    message:
      error instanceof Error
        ? error.message
        : "Unable to complete the request.",
  };
};
