import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Layout } from "../../theme";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
  keyboardAware?: boolean;
  backgroundColor?: string;
  horizontalPadding?: boolean;
  topSafeArea?: boolean;
  bottomSafeArea?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: ViewStyle;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  scrollable = false,
  keyboardAware = false,
  backgroundColor = Colors.background,
  horizontalPadding = true,
  topSafeArea = true,
  bottomSafeArea = true,
  refreshing = false,
  onRefresh,
  contentContainerStyle,
}) => {
  const insets = useSafeAreaInsets();

  const outerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: topSafeArea ? insets.top : 0,
    paddingBottom: bottomSafeArea ? insets.bottom : 0,
  };

  const innerPadding: ViewStyle = horizontalPadding
    ? { paddingHorizontal: Layout.screenHorizontalPadding }
    : {};

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        innerPadding,
        { paddingVertical: Layout.screenVerticalPadding },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, innerPadding, style]}>{children}</View>
  );

  const wrappedContent = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return <View style={outerStyle}>{wrappedContent}</View>;
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
});
