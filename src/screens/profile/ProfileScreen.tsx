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
  Badge,
  Divider,
  SectionCard,
  ScreenSkeleton,
  Button,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import { StudentProfile } from "../../types/user.types";
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

  const student =
    user.role === "student" ? (user as StudentProfile) : undefined;

  const accountItems = [
    {
      label: "Email",
      value: user.email,
      icon: "mail-outline",
    },
    {
      label: "Student ID",
      value: student?.studentId ?? "—",
      icon: "id-card-outline",
    },
    {
      label: "Department",
      value: student?.department ?? user.departmentId ?? "—",
      icon: "business-outline",
    },
    {
      label: "Joined",
      value: user.joinedAt
        ? new Date(user.joinedAt).toLocaleDateString("en-NG", {
            month: "long",
            year: "numeric",
          })
        : "—",
      icon: "calendar-outline",
    },
  ];

  const actions = [
    {
      icon: "settings-outline",
      label: "Settings",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: "shield-checkmark-outline",
      label: "Privacy & Security",
      onPress: () => {},
    },
    {
      icon: "help-circle-outline",
      label: "Supervision Requests",
      onPress: () => navigation.navigate("SupervisionRequests"),
    },
  ];

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
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <AppText style={styles.eyebrow}>My Profile</AppText>

            <AppText style={styles.headerName} numberOfLines={1}>
              {user.fullName}
            </AppText>

            <View style={styles.orgRow}>
              <Ionicons
                name="school-outline"
                size={13}
                color="rgba(255,255,255,0.55)"
              />

              <AppText style={styles.orgName} numberOfLines={1}>
                Ghana Communication Technology University
              </AppText>
            </View>
          </View>

          <Avatar name={user.fullName} uri={user.avatarUrl} size="lg" />
        </View>

        <View style={styles.headerBadges}>
          <Badge
            label={student ? `Level 400` : user.role}
            variant="primary"
            size="md"
          />

          {user.isVerified && (
            <Badge label="Verified" variant="success" size="md" dot />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="school-outline"
                  size={17}
                  color={Colors.accent}
                />
              </View>

              <AppText
                variant="body2"
                weight="bold"
                numberOfLines={1}
                style={styles.statValue}
              >
                {student?.level ?? "400"}
              </AppText>

              <AppText variant="caption" color="tertiary">
                Level
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="business-outline"
                  size={17}
                  color={Colors.accent}
                />
              </View>

              <AppText
                variant="body2"
                weight="bold"
                numberOfLines={1}
                style={styles.statValue}
              >
                {student?.department ?? user.departmentId ?? "-"}
              </AppText>

              <AppText variant="caption" color="tertiary">
                Department
              </AppText>
            </View>
          </View>
        </SectionCard>

        <View style={styles.section}>
          <SectionCard style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <View>
                <AppText variant="h5" weight="semibold">
                  Account Information
                </AppText>

                <AppText
                  variant="caption"
                  color="tertiary"
                  style={styles.sectionSubtitle}
                >
                  Your account and academic details
                </AppText>
              </View>

              <View style={styles.sectionIcon}>
                <Ionicons
                  name="person-circle-outline"
                  size={19}
                  color={Colors.primary}
                />
              </View>
            </View>

            <View style={styles.infoList}>
              {accountItems.map((item, index) => (
                <View key={item.label}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIcon}>
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={16}
                        color={Colors.text.secondary}
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
            </View>
          </SectionCard>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View>
              <AppText variant="h5" weight="semibold">
                Account
              </AppText>

              <AppText
                variant="caption"
                color="tertiary"
                style={styles.sectionSubtitle}
              >
                Manage your account preferences
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
                >
                  <View style={styles.actionIcon}>
                    <Ionicons
                      name={action.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={Colors.primary}
                    />
                  </View>

                  <AppText
                    variant="body2"
                    weight="medium"
                    style={styles.actionLabel}
                    numberOfLines={1}
                  >
                    {action.label}
                  </AppText>

                  <Ionicons
                    name="chevron-forward"
                    size={17}
                    color={Colors.text.tertiary}
                  />
                </TouchableOpacity>

                {index < actions.length - 1 && <Divider spacing={0} />}
              </View>
            ))}
          </SectionCard>
        </View>

        <Button
          variant="danger"
          size="lg"
          label="Sign Out"
          fullWidth
          isLoading={logout.isPending}
          onPress={() =>
            Alert.alert("Sign out", "Are you sure you want to sign out?", [
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
                        error instanceof Error
                          ? error.message
                          : "Please try again.",
                      ),
                  }),
              },
            ])
          }
          style={styles.logoutButton}
        />

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

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[4],
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    color: "rgba(255,255,255,0.65)",
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },

  headerName: {
    color: Colors.text.inverse,
    fontSize: Typography.size["2xl"],
    fontWeight: Typography.weight.bold,
    marginTop: 2,
  },

  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
    minWidth: 0,
  },

  orgName: {
    flex: 1,
    color: "rgba(255,255,255,0.55)",
    fontSize: Typography.size.xs,
  },

  headerBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[4],
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

  statsCard: {
    marginHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    elevation: 12,
    zIndex: 20,
    ...Shadows.md,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statItem: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDim,
    marginBottom: Spacing[1],
  },

  statValue: {
    maxWidth: "100%",
  },

  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: Colors.border.light,
  },

  section: {
    marginTop: Spacing[6],
    paddingHorizontal: Spacing[5],
  },

  sectionHeading: {
    marginBottom: Spacing[3],
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },

  sectionSubtitle: {
    marginTop: 3,
  },

  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryDim,
    flexShrink: 0,
  },

  infoCard: {
    padding: Spacing[4],
  },

  infoList: {
    gap: 0,
  },

  infoRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },

  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    flexShrink: 0,
  },

  infoLabel: {
    width: 76,
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
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[3],
  },

  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  actionLabel: {
    flex: 1,
    minWidth: 0,
  },

  logoutButton: {
    marginHorizontal: Spacing[5],
    marginTop: Spacing[6],
  },

  footer: {
    height: Spacing[4],
  },
});
