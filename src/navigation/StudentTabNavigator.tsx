import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StudentTabParamList } from "./types";
import { StudentDashboardScreen } from "../screens/student/StudentDashboardScreen";
import { SearchScreen } from "../screens/search/SearchScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { StudentCoursesScreen } from "../screens/student/StudentCoursesScreen";
import { Colors, Typography, Spacing, BorderRadius, Shadows } from "../theme";

const Tab = createBottomTabNavigator<StudentTabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: {
  name: keyof StudentTabParamList;
  label: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
}[] = [
  {
    name: "StudentHome",
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    name: "StudentCourses",
    label: "Courses",
    icon: "book-outline",
    activeIcon: "book",
  },
  {
    name: "Search",
    label: "Search",
    icon: "search-outline",
    activeIcon: "search",
  },
  {
    name: "StudentProfile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export const StudentTabNavigator: React.FC = () => {
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
                  ? (config?.activeIcon ?? "home")
                  : (config?.icon ?? "home-outline")
              }
              size={22}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen
        name="StudentHome"
        component={StudentDashboardScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="StudentCourses"
        component={StudentCoursesScreen}
        options={{ title: "Courses" }}
      />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="StudentProfile"
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
