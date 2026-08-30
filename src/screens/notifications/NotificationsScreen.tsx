import React from "react";
import { View, TouchableOpacity, SectionList, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppText, Badge, EmptyState } from "../../components/ui";
import {
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/useNotifications";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatRelativeTime, formatDateGroup } from "../../utils/date.utils";
import { Notification, NotificationType } from "../../types/notification.types";
import { styles } from "./styles/NotificationsScreen.styles";

type Props = NativeStackScreenProps<MainStackParamList, "Notifications">;

type NotificationVisual = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
};

const NOTIFICATION_ICONS: Record<
  string,
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  COLLABORATION_INVITE: {
    name: "people-outline",
    color: Colors.accent,
  },
  COURSE_ENROLLED: {
    name: "person-add-outline",
    color: Colors.accent,
  },
  COURSE_ARCHIVED: {
    name: "archive-outline",
    color: Colors.text.secondary,
  },
  DOCUMENT_UPLOADED: {
    name: "document-text-outline",
    color: Colors.status.success,
  },
  ASSIGNMENT_POSTED: {
    name: "create-outline",
    color: Colors.status.warning,
  },
  ANNOUNCEMENT: {
    name: "megaphone-outline",
    color: Colors.status.warning,
  },
  ORGANIZATION_VERIFIED: {
    name: "shield-checkmark-outline",
    color: Colors.status.success,
  },
  ENROLLMENT_APPROVED: {
    name: "checkmark-circle-outline",
    color: Colors.accent,
  },
};

const NOTIFICATION_VISUALS: Record<NotificationType, NotificationVisual> = {
  COLLABORATION_INVITE: {
    name: "people-outline",
    color: Colors.primary,
    background: Colors.primaryDim,
  },
  COURSE_ENROLLED: {
    name: "person-add-outline",
    color: Colors.accent,
    background: Colors.accentLight,
  },
  COURSE_ARCHIVED: {
    name: "archive-outline",
    color: Colors.text.secondary,
    background: Colors.background,
  },
  DOCUMENT_UPLOADED: {
    name: "document-text-outline",
    color: Colors.status.success,
    background: "rgba(34,197,94,0.12)",
  },
  ASSIGNMENT_POSTED: {
    name: "create-outline",
    color: Colors.status.warning,
    background: "rgba(245,158,11,0.12)",
  },
  ANNOUNCEMENT: {
    name: "megaphone-outline",
    color: Colors.status.warning,
    background: "rgba(245,158,11,0.12)",
  },
  ORGANIZATION_VERIFIED: {
    name: "shield-checkmark-outline",
    color: Colors.status.success,
    background: "rgba(34,197,94,0.12)",
  },
  ENROLLMENT_APPROVED: {
    name: "checkmark-circle-outline",
    color: Colors.accent,
    background: Colors.accentLight,
  },
};

const DEFAULT_VISUAL: NotificationVisual = {
  name: "notifications-outline",
  color: Colors.primary,
  background: Colors.primaryDim,
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: Record<string, Notification[]> = {};

  for (const notification of notifications) {
    const key = formatDateGroup(notification.createdAt);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(notification);
  }

  return Object.entries(groups).map(([title, data]) => ({
    title,
    data,
  }));
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const sections = groupNotificationsByDate(notifications);

  const openNotification = (notification: Notification) => {
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }

    navigation.navigate("NotificationDetails", {
      notificationId: notification.id,
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={21} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <AppText variant="h5" weight="semibold">
            Notifications
          </AppText>

          <AppText variant="caption" color="secondary">
            Stay up to date with your academic activity.
          </AppText>
        </View>

        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <Badge label={String(unreadCount)} variant="error" size="sm" />
          )}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          sections.length === 0 && styles.emptyList,
        ]}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <AppText
              variant="caption"
              weight="semibold"
              color="tertiary"
              style={styles.sectionTitle}
            >
              {section.title.toUpperCase()}
            </AppText>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const visual = NOTIFICATION_VISUALS[item.type] ?? DEFAULT_VISUAL;

          return (
            <View>
              <TouchableOpacity
                style={[
                  styles.notifItem,
                  !item.isRead && styles.notifItemUnread,
                ]}
                activeOpacity={0.72}
                accessibilityRole="button"
                accessibilityLabel={`Open notification: ${item.title}`}
                onPress={() => openNotification(item)}
              >
                <View
                  style={[
                    styles.notifIcon,
                    {
                      backgroundColor: visual.background,
                    },
                    !item.isRead && styles.notifIconUnread,
                  ]}
                >
                  <Ionicons name={visual.name} size={19} color={visual.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifTitleRow}>
                    <AppText
                      variant="body2"
                      weight={item.isRead ? "medium" : "semibold"}
                      numberOfLines={2}
                      style={styles.notifTitle}
                    >
                      {item.title}
                    </AppText>

                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <AppText
                    variant="caption"
                    color="secondary"
                    numberOfLines={2}
                    style={styles.notifBody}
                  >
                    {item.message}
                  </AppText>

                  <View style={styles.notifFooter}>
                    <AppText
                      variant="caption"
                      color="muted"
                      style={styles.notifTime}
                    >
                      {formatRelativeTime(item.createdAt)}
                    </AppText>

                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={Colors.text.tertiary}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {index < section.data.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              icon="notifications-outline"
              title="You're all caught up"
              description="New academic activity, project updates, and invitations will appear here."
            />
          ) : null
        }
      />
    </View>
  );
};
