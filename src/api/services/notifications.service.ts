import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { Notification } from "../../types/notification.types";
import { PaginatedResponse } from "./projects.service";

export const NotificationsService = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>(
      Endpoints.notifications.list,
      { params },
    );
    return data;
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.post(Endpoints.notifications.markRead(id));
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post(Endpoints.notifications.markAllRead);
  },
};
