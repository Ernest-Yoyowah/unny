import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppText, Badge, EmptyState } from "../../components/ui";
import { CourseCard } from "../../components/course/CourseCard";
import { MOCK_COURSES } from "../../data/mock";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<MainStackParamList>;

const TABS = [
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const StudentCoursesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState<TabId>("active");

  const courses = MOCK_COURSES.filter(
    (c) => c.isEnrolled && c.status === activeTab,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h4" weight="bold">
          My Courses
        </AppText>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
          >
            <AppText
              variant="body2"
              weight={activeTab === tab.id ? "semibold" : "regular"}
              color={activeTab === tab.id ? "primary" : "tertiary"}
            >
              {tab.label}
            </AppText>
            {MOCK_COURSES.filter((c) => c.isEnrolled && c.status === tab.id)
              .length > 0 && (
              <Badge
                label={String(
                  MOCK_COURSES.filter(
                    (c) => c.isEnrolled && c.status === tab.id,
                  ).length,
                )}
                variant={activeTab === tab.id ? "primary" : "neutral"}
                size="sm"
              />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {courses.length === 0 ? (
          <EmptyState
            icon={activeTab === "active" ? "book-outline" : "archive-outline"}
            title={
              activeTab === "active"
                ? "No active courses"
                : "No archived courses"
            }
            description={
              activeTab === "active"
                ? "You are not enrolled in any active courses."
                : "Archived course materials will appear here."
            }
          />
        ) : (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() =>
                navigation.navigate("CourseDetails", { courseId: course.id })
              }
            />
          ))
        )}
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
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    gap: Spacing[1],
    marginBottom: Spacing[4],
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  tabActive: {
    backgroundColor: Colors.primaryDim,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
    gap: Spacing[3],
  },
});
