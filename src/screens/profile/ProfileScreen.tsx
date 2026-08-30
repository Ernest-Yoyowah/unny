import React from "react";
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import {
  AppText,
  Avatar,
  Divider,
  SectionCard,
  ScreenSkeleton,
  Button,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
} from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { useLogout } from "../../hooks/useAuth";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  if (!user) {
    return <ScreenSkeleton />;
  }

  const isStudent = user.role === "student";
  const isLecturer = user.role === "lecturer";

  const level = user.level || "—";
  const studentId = user.studentId || "—";
  const department = user.departmentId || "—";

  const joinedDate = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const accountItems = isStudent
    ? [
        {
          label: "Email",
          value: user.email || "—",
          icon: "mail-outline",
          iconBackground: Colors.primaryDim,
          iconColor: Colors.primary,
        },
        {
          label: "Student ID",
          value: studentId,
          icon: "id-card-outline",
          iconBackground: Colors.accentLight,
          iconColor: Colors.accent,
        },
        {
          label: "Department",
          value: department,
          icon: "business-outline",
          iconBackground: Colors.primaryDim,
          iconColor: Colors.primary,
        },
        {
          label: "Joined",
          value: joinedDate,
          icon: "calendar-outline",
          iconBackground: Colors.accentLight,
          iconColor: Colors.accent,
        },
      ]
    : [
        {
          label: "Email",
          value: user.email || "—",
          icon: "mail-outline",
          iconBackground: Colors.primaryDim,
          iconColor: Colors.primary,
        },
        {
          label: "Department",
          value: department,
          icon: "business-outline",
          iconBackground: Colors.primaryDim,
          iconColor: Colors.primary,
        },
        {
          label: "Role",
          value: isLecturer ? "Lecturer" : "—",
          icon: "briefcase-outline",
          iconBackground: Colors.accentLight,
          iconColor: Colors.accent,
        },
        {
          label: "Joined",
          value: joinedDate,
          icon: "calendar-outline",
          iconBackground: Colors.accentLight,
          iconColor: Colors.accent,
        },
      ];

  const actions = [
    {
      icon: "settings-outline",
      label: "Settings",
      description: "App preferences and notifications",
      onPress: () => navigation.navigate("Settings"),
      iconBackground: Colors.primaryDim,
      iconColor: Colors.primary,
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      description: "Manage your account security",
      onPress: () => {},
      iconBackground: "#EEF2FF",
      iconColor: "#4F46E5",
    },
    {
      icon: "people-outline",
      label: "Supervision Requests",
      description: isLecturer
        ? "View and manage student supervision activity"
        : "View and manage supervision activity",
      onPress: () => navigation.navigate("SupervisionRequests"),
      iconBackground: Colors.accentLight,
      iconColor: Colors.accent,
    },
  ];

  const confirmLogout = () => {
    Alert.alert(
      "Sign out",
      "You'll need to sign in again to access your project workspace.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () =>
            logout.mutate(undefined, {
              onError: (error) =>
                Alert.alert(
                  "Sign out failed",
                  error instanceof Error ? error.message : "Please try again.",
                ),
            }),
        },
      ],
    );
  };

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
        translucent={false}
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing[3],
          },
        ]}
      >
        <View style={styles.headerTopBar}>
          <View>
            <AppText style={styles.headerEyebrow}>ACCOUNT</AppText>

            <AppText style={styles.headerTitle}>My Profile</AppText>
          </View>

          <TouchableOpacity
            style={styles.headerSettings}
            activeOpacity={0.75}
            onPress={() => navigation.navigate("Settings")}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color={Colors.text.inverse}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHero}>
          <Avatar name={user.fullName} uri={user.avatarUrl} size="lg" />

          <View style={styles.profileIdentity}>
            <AppText style={styles.profileName} numberOfLines={2}>
              {user.fullName}
            </AppText>

            <View style={styles.profileInstitution}>
              <Ionicons
                name="school-outline"
                size={14}
                color="rgba(255,255,255,0.58)"
              />

              <AppText style={styles.profileInstitutionText} numberOfLines={2}>
                Ghana Communication Technology University
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.headerBadges}>
          {isStudent && (
            <View style={styles.academicBadge}>
              <Ionicons
                name="school-outline"
                size={13}
                color={Colors.text.inverse}
              />

              <AppText style={styles.academicBadgeText}>Level {level}</AppText>
            </View>
          )}

          {isLecturer && (
            <View style={styles.academicBadge}>
              <Ionicons
                name="briefcase-outline"
                size={13}
                color={Colors.text.inverse}
              />

              <AppText style={styles.academicBadgeText}>Lecturer</AppText>
            </View>
          )}

          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#BBF7D0" />

              <AppText style={styles.verifiedBadgeText}>Verified</AppText>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.academicCard}>
          <View style={styles.academicCardHeader}>
            <View style={styles.academicCardHeaderText}>
              <AppText variant="caption" color="tertiary">
                {isStudent ? "ACADEMIC PROFILE" : "PROFESSIONAL PROFILE"}
              </AppText>

              <AppText variant="h5" weight="semibold">
                {isStudent
                  ? "Your academic identity"
                  : "Your professional identity"}
              </AppText>
            </View>

            <View style={styles.academicCardIcon}>
              <Ionicons
                name={isStudent ? "school-outline" : "briefcase-outline"}
                size={19}
                color={Colors.primary}
              />
            </View>
          </View>

          <View style={styles.academicGrid}>
            <View style={styles.academicItem}>
              <AppText variant="caption" color="tertiary">
                {isStudent ? "Level" : "Role"}
              </AppText>

              <AppText
                variant="body2"
                weight="bold"
                numberOfLines={2}
                style={styles.academicValue}
              >
                {isStudent ? level : "Lecturer"}
              </AppText>
            </View>

            <View style={styles.academicGridDivider} />

            <View style={styles.academicItem}>
              <AppText variant="caption" color="tertiary">
                Department
              </AppText>

              <AppText
                variant="body2"
                weight="bold"
                numberOfLines={2}
                style={styles.academicValue}
              >
                {department}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionHeadingText}>
              <AppText variant="h5" weight="semibold">
                Account information
              </AppText>

              <AppText
                variant="caption"
                color="tertiary"
                style={styles.sectionSubtitle}
              >
                Details connected to your account
              </AppText>
            </View>

            <View style={styles.sectionHeadingIcon}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.primary}
              />
            </View>
          </View>

          <SectionCard style={styles.infoCard}>
            {accountItems.map((item, index) => (
              <View key={item.label}>
                <View style={styles.infoRow}>
                  <View
                    style={[
                      styles.infoIcon,
                      { backgroundColor: item.iconBackground },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as keyof typeof Ionicons.glyphMap}
                      size={16}
                      color={item.iconColor}
                    />
                  </View>

                  <View style={styles.infoLabel}>
                    <AppText variant="caption" color="tertiary">
                      {item.label}
                    </AppText>
                  </View>

                  <AppText
                    variant="body2"
                    weight="medium"
                    numberOfLines={2}
                    style={styles.infoValue}
                  >
                    {item.value}
                  </AppText>
                </View>

                {index < accountItems.length - 1 && (
                  <Divider spacing={Spacing[3]} />
                )}
              </View>
            ))}
          </SectionCard>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionHeadingText}>
              <AppText variant="h5" weight="semibold">
                Account controls
              </AppText>

              <AppText
                variant="caption"
                color="tertiary"
                style={styles.sectionSubtitle}
              >
                Manage your preferences and access
              </AppText>
            </View>
          </View>

          <SectionCard style={styles.actionsCard}>
            {actions.map((action, index) => (
              <View key={action.label}>
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  accessibilityHint={action.description}
                >
                  <View
                    style={[
                      styles.actionIcon,
                      { backgroundColor: action.iconBackground },
                    ]}
                  >
                    <Ionicons
                      name={action.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={action.iconColor}
                    />
                  </View>

                  <View style={styles.actionContent}>
                    <AppText
                      variant="body2"
                      weight="semibold"
                      numberOfLines={1}
                    >
                      {action.label}
                    </AppText>

                    <AppText
                      variant="caption"
                      color="tertiary"
                      numberOfLines={1}
                      style={styles.actionDescription}
                    >
                      {action.description}
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={Colors.text.tertiary}
                  />
                </TouchableOpacity>

                {index < actions.length - 1 && <Divider spacing={0} />}
              </View>
            ))}
          </SectionCard>
        </View>

        <View style={styles.accountFooter}>
          <View style={styles.memberSince}>
            <View style={styles.memberIcon}>
              <Ionicons
                name="time-outline"
                size={15}
                color={Colors.text.secondary}
              />
            </View>

            <View>
              <AppText variant="caption" color="tertiary">
                Member since
              </AppText>

              <AppText variant="caption" weight="semibold">
                {joinedDate}
              </AppText>
            </View>
          </View>
        </View>

        <Button
          variant="danger"
          size="lg"
          label="Sign Out"
          fullWidth
          isLoading={logout.isPending}
          onPress={confirmLogout}
          style={styles.logoutButton}
        />

        <AppText variant="caption" color="tertiary" style={styles.versionText}>
          Your account information is securely managed.
        </AppText>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[9],
  },

  headerTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerEyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1,
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },

  headerSettings: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing[6],
    gap: Spacing[4],
  },

  profileIdentity: {
    flex: 1,
    minWidth: 0,
  },

  profileName: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xl,
    lineHeight: 27,
    fontWeight: Typography.weight.bold,
  },

  profileInstitution: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[1],
    marginTop: Spacing[2],
    paddingRight: Spacing[2],
  },

  profileInstitutionText: {
    flex: 1,
    color: "rgba(255,255,255,0.58)",
    fontSize: Typography.size.xs,
    lineHeight: 17,
  },

  headerBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[4],
  },

  academicBadge: {
    minHeight: 30,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.14)",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },

  academicBadgeText: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },

  verifiedBadge: {
    minHeight: 30,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(34,197,94,0.16)",
    borderWidth: 1,
    borderColor: "rgba(187,247,208,0.2)",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
  },

  verifiedBadgeText: {
    color: "#BBF7D0",
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[7],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },

  content: {
    paddingTop: Spacing[2],
    paddingBottom: Spacing[10],
  },

  academicCard: {
    marginHorizontal: Spacing[5],
    padding: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    elevation: 10,
  },

  academicCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
  },

  academicCardHeaderText: {
    flex: 1,
    minWidth: 0,
  },

  academicCardIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  academicGrid: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  academicItem: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: Spacing[1],
  },

  academicValue: {
    marginTop: Spacing[1],
  },

  academicGridDivider: {
    width: 1,
    backgroundColor: Colors.border.light,
    marginHorizontal: Spacing[3],
  },

  section: {
    marginTop: Spacing[6],
    paddingHorizontal: Spacing[5],
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },

  sectionHeadingText: {
    flex: 1,
    minWidth: 0,
  },

  sectionSubtitle: {
    marginTop: 3,
  },

  sectionHeadingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoCard: {
    padding: Spacing[4],
  },

  infoRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoLabel: {
    flexShrink: 0,
  },

  infoValue: {
    flex: 1,
    minWidth: 0,
    textAlign: "right",
  },

  actionsCard: {
    padding: 0,
    overflow: "hidden",
  },

  actionRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionContent: {
    flex: 1,
    minWidth: 0,
  },

  actionDescription: {
    marginTop: 2,
  },

  accountFooter: {
    marginHorizontal: Spacing[5],
    marginTop: Spacing[6],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  memberSince: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  memberIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutButton: {
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
  },

  versionText: {
    textAlign: "center",
    marginHorizontal: Spacing[6],
    marginTop: Spacing[3],
    lineHeight: 17,
  },

  footer: {
    height: Spacing[4],
  },
});
