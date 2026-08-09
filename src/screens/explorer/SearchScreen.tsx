import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppText, EmptyState } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";
import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

import { MOCK_PROJECTS } from "../../data/project.mock";
import { ProjectRepositoryCard } from "@/components/project/ProjectRepositoryCard";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const filteredProjects = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return MOCK_PROJECTS;
    }

    const search = debouncedQuery.toLowerCase();

    return MOCK_PROJECTS.filter(
      (project) =>
        project.title.toLowerCase().includes(search) ||
        project.department.toLowerCase().includes(search) ||
        project.yearGroup.toLowerCase().includes(search) ||
        project.status.toLowerCase().includes(search),
    );
  }, [debouncedQuery]);

  const hasQuery = query.trim().length > 0;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          Explore Projects
        </AppText>

        <AppText variant="body2" color="secondary" style={styles.subtitle}>
          Browse documented final year projects across the university.
        </AppText>
      </View>

      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <Ionicons name="search-outline" size={19} color={Colors.primary} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Search projects, departments..."
          placeholderTextColor={Colors.text.tertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />

        {hasQuery && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setQuery("")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={19}
              color={Colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.resultsHeader}>
        <AppText variant="caption" color="secondary">
          {hasQuery
            ? `${filteredProjects.length} ${
                filteredProjects.length === 1 ? "project" : "projects"
              } found`
            : `${filteredProjects.length} projects`}
        </AppText>
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <EmptyState
              icon="search-outline"
              title="No projects found"
              description="Try searching using another keyword."
            />
          </View>
        )}
        renderItem={({ item }) => (
          <ProjectRepositoryCard
            project={item}
            onPress={() =>
              navigation.navigate("ProjectDetails", {
                projectId: item.id,
              })
            }
          />
        )}
      />
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
    marginBottom: Spacing[5],
  },

  subtitle: {
    marginTop: Spacing[2],
  },

  searchBar: {
    height: 52,
    marginHorizontal: Spacing[5],
    paddingHorizontal: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Shadows.sm,
  },

  searchIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryDim,
  },

  input: {
    flex: 1,
    marginLeft: Spacing[3],
    paddingVertical: 0,
    color: Colors.text.primary,
    fontSize: 14,
  },

  clearButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  resultsHeader: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },

  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[12],
  },

  separator: {
    height: Spacing[3],
  },

  emptyState: {
    paddingTop: Spacing[10],
    alignItems: "center",
  },
});
