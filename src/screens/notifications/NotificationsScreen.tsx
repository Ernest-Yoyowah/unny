import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SectionList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge, Divider, EmptyState } from "../../components/ui";
import {
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/useNotifications";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatRelativeTime, formatDateGroup } from "../../utils/date.utils";
import { Notification, NotificationType } from "../../types/notification.types";

type Props = NativeStackScreenProps<MainStackParamList, "Notifications">;

const NOTIFICATION_ICONS: Record<
  NotificationType,
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  course_enrolled: { name: "person-add-outline", color: Colors.accent },
  course_archived: { name: "archive-outline", color: Colors.text.secondary },
  document_uploaded: {
    name: "document-text-outline",
    color: Colors.status.success,
  },
  assignment_posted: { name: "create-outline", color: Colors.status.warning },
  announcement: { name: "megaphone-outline", color: Colors.status.warning },
  organization_verified: {
    name: "shield-checkmark-outline",
    color: Colors.status.success,
  },
  enrollment_approved: {
    name: "checkmark-circle-outline",
    color: Colors.accent,
  },
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    const key = formatDateGroup(n.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  }
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const notifications = data?.data ?? [];

  const sections = groupNotificationsByDate(notifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <AppText variant="h5" weight="semibold">
          Notifications
        </AppText>
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
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
        renderItem={({ item, index, section }) => (
          <View>
            <TouchableOpacity
              style={[styles.notifItem, !item.isRead && styles.notifItemUnread]}
              activeOpacity={0.75}
              accessibilityRole="button"
              onPress={() => !item.isRead && markRead.mutate(item.id)}
            >
              <View
                style={[
                  styles.notifIcon,
                  !item.isRead && styles.notifIconUnread,
                ]}
              >
                <Ionicons
                  name={
                    NOTIFICATION_ICONS[item.type]?.name ??
                    "notifications-outline"
                  }
                  size={18}
                  color={
                    NOTIFICATION_ICONS[item.type]?.color ??
                    Colors.text.secondary
                  }
                />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifTitleRow}>
                  <AppText
                    variant="body2"
                    weight={item.isRead ? "regular" : "semibold"}
                    numberOfLines={1}
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
                  {item.body}
                </AppText>
                <AppText
                  variant="caption"
                  color="muted"
                  style={styles.notifTime}
                >
                  {formatRelativeTime(item.createdAt)}
                </AppText>
              </View>
            </TouchableOpacity>
            {index < section.data.length - 1 && (
              <View style={styles.itemDivider} />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            icon="notifications-outline"
            title="No notifications"
            description="You're all caught up."
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -Spacing[2],
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  list: {
    paddingBottom: Spacing[10],
  },
  sectionHeader: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[2],
  },
  sectionTitle: {
    letterSpacing: 1,
  },
  notifItem: {
    flexDirection: "row",
    gap: Spacing[3],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    backgroundColor: Colors.surface,
  },
  notifItemUnread: {
    backgroundColor: `${Colors.accent}06`,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifIconUnread: {
    backgroundColor: Colors.accentLight,
  },
  notifContent: {
    flex: 1,
    gap: 3,
  },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  notifTitle: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    flexShrink: 0,
  },
  notifBody: {
    lineHeight: 18,
  },
  notifTime: {
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginLeft: Spacing[5] + 40 + Spacing[3],
  },
});
