import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.unny.app/v1";
const REQUEST_TIMEOUT = 15000;

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
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.REFRESH_TOKEN);
      await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.USER_DATA);
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
    const data = error.response?.data as Record<string, unknown> | undefined;
    return {
      message:
        (data?.message as string) ??
        error.message ??
        "An unexpected error occurred.",
      code: data?.code as string | undefined,
      statusCode: error.response?.status,
    };
  }
  return { message: "An unexpected error occurred." };
};
