import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { Notification } from "../../types/notification.types";
import { PaginatedResponse } from "./projects.service";

const dedupeNotifications = (items: Notification[] = []) => {
  const byId = new Map<string, Notification>();

  for (const notification of items) {
    const current = byId.get(notification.id);
    if (!current) {
      byId.set(notification.id, notification);
      continue;
    }

    const currentTime = new Date(current.createdAt).getTime();
    const nextTime = new Date(notification.createdAt).getTime();

    if (Number.isNaN(nextTime) || nextTime >= currentTime) {
      byId.set(notification.id, notification);
    }
  }

  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

export const NotificationsService = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Notification>> => {
    const { data } = await apiClient.get<PaginatedResponse<Notification>>(
      Endpoints.notifications.list,
      { params },
    );

    return {
      ...data,
      data: dedupeNotifications(data?.data ?? []),
    };
  },

  markRead: async (id: string): Promise<void> => {
    await apiClient.patch(Endpoints.notifications.markRead(id));
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.patch(Endpoints.notifications.markAllRead);
  },

  registerDevice: async (token: string, platform: string): Promise<void> => {
    await apiClient.post(Endpoints.notifications.devices, { token, platform });
  },

  unregisterDevice: async (token: string): Promise<void> => {
    await apiClient.delete(Endpoints.notifications.devices, {
      data: { token },
    });
  },
};
