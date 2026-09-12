import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/auth.store";
import { RootStackParamList } from "./types";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import { OnboardingScreen } from "../screens/onboarding/OnboardingScreen";
import { SplashScreen } from "@/screens/onboarding/SplashScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  const initialRouteName = isInitializing
    ? "Splash"
    : isAuthenticated
      ? "Main"
      : "Splash";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
      initialRouteName={initialRouteName}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{
              animation: "slide_from_right",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
