import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppText, EmptyState } from "../../components/ui";
import { CourseCard } from "../../components/course/CourseCard";
import { OrganizationCard } from "../../components/organization/OrganizationCard";
import { MOCK_COURSES, MOCK_ORGANIZATIONS } from "../../data/mock";
import { useDebounce } from "../../hooks/useDebounce";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<MainStackParamList>;

type SearchTab = "courses" | "organizations";

export const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<SearchTab>("courses");

  const debouncedQuery = useDebounce(query, 400);

  const filteredCourses =
    debouncedQuery.length >= 2
      ? MOCK_COURSES.filter(
          (c) =>
            c.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            c.lecturerName.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : [];

  const filteredOrgs =
    debouncedQuery.length >= 2
      ? MOCK_ORGANIZATIONS.filter(
          (o) =>
            o.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            o.shortName.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : [];

  const hasQuery = debouncedQuery.length >= 2;
  const isLoading = query.length >= 2 && debouncedQuery !== query;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Ionicons
            name="search-outline"
            size={18}
            color={Colors.text.tertiary}
          />
          <TextInput
            style={styles.input}
            placeholder="Search courses, organizations..."
            placeholderTextColor={Colors.text.tertiary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoFocus={false}
            allowFontScaling={false}
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.text.tertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabBar}>
        {(["courses", "organizations"] as SearchTab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
          >
            <AppText
              variant="body2"
              weight={tab === t ? "semibold" : "regular"}
              color={tab === t ? "primary" : "tertiary"}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </AppText>
            {tab === t && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabUnderline} />

      {!hasQuery ? (
        <View style={styles.placeholder}>
          <Ionicons
            name="search-outline"
            size={44}
            color={Colors.border.strong}
          />
          <AppText
            variant="body1"
            color="tertiary"
            style={styles.placeholderText}
          >
            Search for courses or organizations
          </AppText>
          <AppText variant="caption" color="muted">
            Type at least 2 characters to search
          </AppText>
        </View>
      ) : isLoading ? (
        <View style={styles.placeholder}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : tab === "courses" ? (
        <FlatList
          data={filteredCourses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <EmptyState
              icon="search-outline"
              title="No courses found"
              description={`No results for "${debouncedQuery}"`}
            />
          )}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              variant="compact"
              onPress={() =>
                navigation.navigate("CourseDetails", { courseId: item.id })
              }
            />
          )}
        />
      ) : (
        <FlatList
          data={filteredOrgs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <EmptyState
              icon="search-outline"
              title="No organizations found"
              description={`No results for "${debouncedQuery}"`}
            />
          )}
          renderItem={({ item }) => (
            <OrganizationCard
              organization={item}
              variant="search"
              onPress={() => {}}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing[4],
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    fontFamily: "System",
    padding: 0,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: Spacing[5],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  tab: {
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[3],
    marginRight: Spacing[2],
    position: "relative",
  },
  tabActive: {},
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: Spacing[3],
    right: Spacing[3],
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  tabUnderline: {
    height: 1,
    backgroundColor: Colors.border.light,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[3],
    paddingHorizontal: Spacing[8],
  },
  placeholderText: {
    textAlign: "center",
  },
  list: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  separator: {
    height: Spacing[3],
  },
});
