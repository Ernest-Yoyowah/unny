import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LecturerTabParamList } from "./types";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { Colors, Typography, Spacing, Shadows } from "../theme";
import { LecturerDashboardScreen } from "@/screens/dashboard/AdminDashboard";
import { LecturerCoursesScreen } from "@/screens/moderation/PendingProjectsScreen";
import { LecturerCoursesScreen as LecturerResourcesScreen } from "@/screens/moderation/PendingProjectsScreen";

const Tab = createBottomTabNavigator<LecturerTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: {
  name: keyof LecturerTabParamList;
  label: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
}[] = [
  {
    name: "LecturerHome",
    label: "Dashboard",
    icon: "grid-outline",
    activeIcon: "grid",
  },
  {
    name: "LecturerCourses",
    label: "Courses",
    icon: "book-outline",
    activeIcon: "book",
  },
  {
    name: "LecturerResources",
    label: "Resources",
    icon: "folder-outline",
    activeIcon: "folder",
  },
  {
    name: "LecturerProfile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export const LecturerTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const config = TAB_CONFIG.find((c) => c.name === route.name);
        return {
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBar,
            height: 56 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.text.tertiary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={
                focused
                  ? (config?.activeIcon ?? "grid")
                  : (config?.icon ?? "grid-outline")
              }
              size={22}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen
        name="LecturerHome"
        component={LecturerDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="LecturerCourses"
        component={LecturerCoursesScreen}
        options={{ title: "Courses" }}
      />
      <Tab.Screen
        name="LecturerResources"
        component={LecturerResourcesScreen}
        options={{ title: "Resources" }}
      />
      <Tab.Screen
        name="LecturerProfile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing[1.5],
    ...Platform.select({
      ios: Shadows.md,
      android: { elevation: 8 },
    }),
  },
  tabLabel: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.medium,
    marginTop: 2,
  },
});
