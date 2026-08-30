import React from "react";
import { View, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppText, Button } from "../../components/ui";
import {
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/useNotifications";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatRelativeTime } from "../../utils/date.utils";
import { NotificationType } from "../../types/notification.types";
import { styles } from "./styles/NotificationDetailsScreen.styles";

type Props = NativeStackScreenProps<MainStackParamList, "NotificationDetails">;

const ICONS: Record<
  NotificationType,
  {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
  }
> = {
  COLLABORATION_INVITE: {
    name: "people-outline",
    color: Colors.primary,
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

export const NotificationDetailsScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const markRead = useMarkNotificationRead();
  const { data } = useNotifications();

  const notification = data?.data.find(
    (item) => item.id === route.params.notificationId,
  );

  React.useEffect(() => {
    if (notification && !notification.isRead) {
      markRead.mutate(notification.id);
    }
  }, [notification?.id]);

  if (!notification) {
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
          >
            <Ionicons name="arrow-back" size={21} color={Colors.text.primary} />
          </TouchableOpacity>

          <AppText variant="h5" weight="semibold">
            Notification
          </AppText>
        </View>

        <View style={styles.notFound}>
          <View style={styles.notFoundIcon}>
            <Ionicons
              name="notifications-off-outline"
              size={28}
              color={Colors.text.tertiary}
            />
          </View>

          <AppText variant="h5" weight="semibold">
            Notification unavailable
          </AppText>

          <AppText
            variant="body2"
            color="secondary"
            style={styles.notFoundText}
          >
            This notification may have been removed or is no longer available.
          </AppText>
        </View>
      </View>
    );
  }

  const icon = ICONS[notification.type] ?? {
    name: "notifications-outline" as keyof typeof Ionicons.glyphMap,
    color: Colors.primary,
  };

  const isCollaborationInvite =
    notification.type === "COLLABORATION_INVITE" &&
    !!notification.relatedProjectId;

  const openAction = () => {
    if (!notification.relatedProjectId) {
      return;
    }

    navigation.navigate("CollaborationRequest", {
      notificationId: notification.id,
      projectId: notification.relatedProjectId,
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

        <AppText variant="h5" weight="semibold">
          Notification
        </AppText>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing[8],
          },
        ]}
      >
        <View style={styles.hero}>
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: Colors.primaryDim,
              },
            ]}
          >
            <Ionicons name={icon.name} size={31} color={icon.color} />
          </View>

          <AppText variant="overline" color="tertiary" style={styles.typeLabel}>
            {notification.type.replaceAll("_", " ")}
          </AppText>

          <AppText variant="h3" weight="bold" style={styles.title}>
            {notification.title}
          </AppText>

          <AppText variant="caption" color="secondary" style={styles.time}>
            {formatRelativeTime(notification.createdAt)}
          </AppText>
        </View>

        <View style={styles.messageCard}>
          <AppText variant="body1" color="secondary" style={styles.message}>
            {notification.message}
          </AppText>
        </View>

        {isCollaborationInvite && (
          <View style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons
                name="people-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View style={styles.actionContent}>
              <AppText variant="body2" weight="semibold">
                Collaboration invitation
              </AppText>

              <AppText variant="caption" color="secondary">
                Review the project and decide whether you want to join the
                collaboration.
              </AppText>
            </View>
          </View>
        )}

        {isCollaborationInvite && (
          <View style={styles.bottomAction}>
            <Button
              variant="primary"
              size="lg"
              label="Review invitation"
              fullWidth
              onPress={openAction}
              rightIcon={
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={Colors.text.inverse}
                />
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};
