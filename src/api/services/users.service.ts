import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { User } from "../../types/user.types";

export const UsersService = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>(Endpoints.users.me);
    return data;
  },

  getProfile: async (id: string): Promise<User> => {
    const { data } = await apiClient.get<User>(Endpoints.users.profile(id));
    return data;
  },

  updateProfile: async (
    payload: Partial<Pick<User, "fullName" | "avatarUrl">>,
  ): Promise<User> => {
    const { data } = await apiClient.patch<User>(
      Endpoints.users.updateProfile,
      payload,
    );
    return data;
  },

  uploadAvatar: async (
    fileUri: string,
    fileName: string,
  ): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append("avatar", {
      uri: fileUri,
      name: fileName,
      type: "image/jpeg",
    } as unknown as Blob);

    const { data } = await apiClient.post<{ avatarUrl: string }>(
      Endpoints.users.uploadAvatar,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};
