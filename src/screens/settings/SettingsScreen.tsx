import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import {
  AppText,
  Avatar,
  Divider,
  SectionCard,
  Button,
} from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<MainStackParamList, "Settings">;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    await clearAuth();
  };

  const SETTINGS_SECTIONS = [
    {
      title: "Account",
      items: [
        {
          icon: "person-outline",
          label: "Edit Profile",
          onPress: () => {},
          chevron: true,
        },
        {
          icon: "lock-closed-outline",
          label: "Change Password",
          onPress: () => {},
          chevron: true,
        },
        {
          icon: "mail-outline",
          label: "Email Preferences",
          onPress: () => {},
          chevron: true,
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: "notifications-outline",
          label: "Push Notifications",
          onPress: () => {},
          toggle: true,
          toggleValue: true,
        },
        {
          icon: "mail-unread-outline",
          label: "Email Notifications",
          onPress: () => {},
          toggle: true,
          toggleValue: false,
        },
      ],
    },
    {
      title: "Institution",
      items: [
        {
          icon: "business-outline",
          label: "My Organization",
          onPress: () => navigation.navigate("OrganizationDiscovery"),
          chevron: true,
        },
        {
          icon: "shield-checkmark-outline",
          label: "Verification Status",
          onPress: () => {},
          chevron: true,
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: "document-text-outline",
          label: "Terms of Service",
          onPress: () => {},
          chevron: true,
        },
        {
          icon: "shield-outline",
          label: "Privacy Policy",
          onPress: () => {},
          chevron: true,
        },
        {
          icon: "help-circle-outline",
          label: "Help & Support",
          onPress: () => {},
          chevron: true,
        },
        {
          icon: "information-circle-outline",
          label: "App Version",
          onPress: undefined,
          value: "1.0.0",
        },
      ],
    },
  ];

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
          Settings
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {user && (
          <View style={styles.userCard}>
            <Avatar name={user.fullName} uri={user.avatarUrl} size="lg" />
            <View style={styles.userInfo}>
              <AppText variant="body1" weight="semibold">
                {user.fullName}
              </AppText>
              <AppText variant="body2" color="tertiary">
                {user.email}
              </AppText>
              <AppText variant="caption" color="tertiary">
                {user.organizationName}
              </AppText>
            </View>
          </View>
        )}

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <AppText
              variant="overline"
              color="tertiary"
              style={styles.sectionTitle}
            >
              {section.title.toUpperCase()}
            </AppText>
            <SectionCard style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <View key={item.label}>
                  <TouchableOpacity
                    style={styles.settingRow}
                    onPress={item.onPress}
                    activeOpacity={item.onPress ? 0.7 : 1}
                    disabled={!item.onPress}
                    accessibilityRole={item.onPress ? "button" : "none"}
                  >
                    <View style={styles.settingIcon}>
                      <Ionicons
                        name={item.icon as keyof typeof Ionicons.glyphMap}
                        size={18}
                        color={Colors.text.secondary}
                      />
                    </View>
                    <AppText
                      variant="body2"
                      weight="medium"
                      style={styles.settingLabel}
                    >
                      {item.label}
                    </AppText>
                    {"value" in item && item.value && (
                      <AppText variant="body2" color="tertiary">
                        {item.value}
                      </AppText>
                    )}
                    {"toggle" in item && item.toggle ? (
                      <Switch
                        value={item.toggleValue}
                        onValueChange={() => {}}
                        trackColor={{
                          false: Colors.border.default,
                          true: Colors.accent,
                        }}
                        thumbColor={Colors.text.inverse}
                      />
                    ) : (
                      "chevron" in item &&
                      item.chevron && (
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={Colors.text.tertiary}
                        />
                      )
                    )}
                  </TouchableOpacity>
                  {index < section.items.length - 1 && <Divider spacing={0} />}
                </View>
              ))}
            </SectionCard>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <Button
            variant="danger"
            size="lg"
            label="Sign Out"
            fullWidth
            onPress={handleLogout}
            leftIcon={
              <Ionicons
                name="log-out-outline"
                size={18}
                color={Colors.text.inverse}
              />
            }
          />
        </View>
      </ScrollView>
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
  },
  content: {
    paddingBottom: Spacing[12],
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    padding: Spacing[5],
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  userInfo: {
    flex: 1,
    gap: 3,
  },
  section: {
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[6],
  },
  sectionTitle: {
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },
  sectionCard: {
    padding: 0,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    flex: 1,
  },
  logoutSection: {
    paddingHorizontal: Spacing[5],
    marginTop: Spacing[8],
  },
});
