import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge, EmptyState } from "../../components/ui";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { ProjectRepositoryCard } from "@/components/project/ProjectRepositoryCard";
import { useModerationQueue } from "../../hooks/useModerationQueue";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const LecturerCoursesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { data: projects = [], isLoading } = useModerationQueue();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h4" weight="bold">
          Review Queue
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {isLoading || projects.length === 0 ? (
          <EmptyState
            icon="checkmark-circle-outline"
            title={isLoading ? "Loading review queue" : "Queue is clear"}
            description="Projects awaiting your review will appear here."
          />
        ) : (
          projects.map((project) => (
            <ProjectRepositoryCard
              key={project.id}
              project={{
                id: project.id,
                title: project.title,
                department: project.department ?? "Department unavailable",
                yearGroup:
                  project.academicYear?.toString() ?? "Year unavailable",
                status: project.status,
                student: project.submittedBy?.fullName,
                supervisor: project.supervisor?.fullName,
              }}
              onPress={() =>
                navigation.navigate("ProjectDetails", { projectId: project.id })
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
