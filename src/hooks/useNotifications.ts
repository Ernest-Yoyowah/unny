import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService } from "../api/services/notifications.service";

export const NOTIFICATIONS_KEY = ["notifications"];

export const useNotifications = () =>
  useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: () =>
      NotificationsService.getNotifications({ page: 1, limit: 50 }),
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationsService.markRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: NotificationsService.markAllRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
};
