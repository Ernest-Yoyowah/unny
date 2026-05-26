import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/auth.store";
import { MainStackParamList } from "./types";
import { StudentTabNavigator } from "./StudentTabNavigator";
import { LecturerTabNavigator } from "./LecturerTabNavigator";
import { CourseDetailsScreen } from "../screens/course/CourseDetailsScreen";
import { CourseArchiveScreen } from "../screens/course/CourseArchiveScreen";
import { EnrollmentFlowScreen } from "../screens/course/EnrollmentFlowScreen";
import { NotificationsScreen } from "../screens/notifications/NotificationsScreen";
import { SettingsScreen } from "../screens/settings/SettingsScreen";
import { OrganizationDiscoveryScreen } from "../screens/organization/DiscoveryScreen";
import { CreateOrganizationScreen } from "../screens/organization/CreateOrganizationScreen";
import { VerificationFlowScreen } from "../screens/organization/VerificationFlowScreen";
import { DocumentViewerScreen } from "../screens/document/DocumentViewerScreen";

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const isLecturer = user?.role === "lecturer" || user?.role === "admin";

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {isLecturer ? (
        <Stack.Screen name="LecturerTabs" component={LecturerTabNavigator} />
      ) : (
        <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
      )}
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CourseArchive" component={CourseArchiveScreen} />
      <Stack.Screen name="EnrollmentFlow" component={EnrollmentFlowScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="OrganizationDiscovery"
        component={OrganizationDiscoveryScreen}
      />
      <Stack.Screen
        name="CreateOrganization"
        component={CreateOrganizationScreen}
      />
      <Stack.Screen
        name="VerificationFlow"
        component={VerificationFlowScreen}
      />
      <Stack.Screen
        name="DocumentViewer"
        component={DocumentViewerScreen}
        options={{ animation: "slide_from_bottom", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
};
