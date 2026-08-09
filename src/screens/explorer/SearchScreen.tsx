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
import { Colors, Spacing, BorderRadius } from "../../theme";
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          Explore Projects
        </AppText>

        <AppText variant="body2" color="secondary" style={styles.subtitle}>
          Browse documented final year projects across the university.
        </AppText>
      </View>

      <View style={styles.searchBar}>
        <Ionicons
          name="search-outline"
          size={18}
          color={Colors.text.tertiary}
        />

        <TextInput
          style={styles.input}
          placeholder="Search projects, departments..."
          placeholderTextColor={Colors.text.tertiary}
          value={query}
          onChangeText={setQuery}
        />

        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={Colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing[3] }} />}
        ListEmptyComponent={() => (
          <EmptyState
            icon="search-outline"
            title="No projects found"
            description="Try searching using another keyword."
          />
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
    marginHorizontal: Spacing[5],
    marginBottom: Spacing[5],

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: Colors.surface,

    borderRadius: BorderRadius.xl,

    paddingHorizontal: Spacing[4],

    height: 50,

    borderWidth: 1,
    borderColor: Colors.border.default,
  },

  input: {
    flex: 1,
    marginLeft: Spacing[3],
    color: Colors.text.primary,
  },

  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[12],
  },
});
