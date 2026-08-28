import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "../store/auth.store";
import { MainStackParamList } from "./types";

import { StudentTabNavigator } from "./StudentTabNavigator";
import { LecturerTabNavigator } from "./LecturerTabNavigator";

import { NotificationsScreen } from "../screens/notifications/NotificationsScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";

import { DocumentViewerScreen } from "../screens/project/ProjectDocumentScreen";
import { ProjectDetailsScreen } from "../screens/project/ProjectDetailsScreen";
import { AddProjectScreen } from "@/screens/project/AddProjectScreen";
import { ProjectTimelineScreen } from "../screens/project/ProjectTimelineScreen";
import { SupervisionRequestsScreen } from "../screens/project/SupervisionRequestsScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  const user = useAuthStore((s) => s.user);

  const isLecturer = user?.role === "lecturer" || user?.role === "admin";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {isLecturer ? (
        <Stack.Screen name="LecturerTabs" component={LecturerTabNavigator} />
      ) : (
        <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      )}

      <Stack.Screen name="ProjectDetails" component={ProjectDetailsScreen} />
      <Stack.Screen name="AddProject" component={AddProjectScreen} />
      <Stack.Screen name="ProjectTimeline" component={ProjectTimelineScreen} />
      <Stack.Screen
        name="SupervisionRequests"
        component={SupervisionRequestsScreen}
      />

      <Stack.Screen
        name="DocumentViewer"
        component={DocumentViewerScreen}
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
