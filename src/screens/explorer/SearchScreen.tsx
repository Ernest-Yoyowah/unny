import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppText, EmptyState, Skeleton, Card } from "../../components/ui";
import { useDebounce } from "../../hooks/useDebounce";
import { useExplore } from "../../hooks/useExplore";
import {
  Colors,
  Spacing,
  BorderRadius,
  Shadows,
  Typography,
} from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { ProjectRepositoryCard } from "@/components/project/ProjectRepositoryCard";
import { styles } from "./SearchScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isError, error, refetch } =
    useExplore(debouncedQuery);

  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const users = Array.isArray(data?.users) ? data.users : [];

  const hasQuery = query.trim().length > 0;

  const getUserName = (user: (typeof users)[number]) => {
    return (
      user.fullName ?? user.profile?.fullName ?? user.email ?? "Unnamed user"
    );
  };

  const getUserDepartment = (user: (typeof users)[number]) => {
    return user.department ?? user.profile?.department ?? "Academic community";
  };

  const getUserRole = (user: (typeof users)[number]) => {
    return user.role?.toUpperCase() ?? "STUDENT";
  };

  const getProjectStudent = (project: (typeof projects)[number]) => {
    return (
      project.submittedBy?.fullName ?? project.submittedBy?.name ?? undefined
    );
  };

  const getProjectSupervisor = (project: (typeof projects)[number]) => {
    return (
      project.supervisor?.fullName ?? project.supervisor?.name ?? undefined
    );
  };

  const renderPerson = ({ item }: { item: (typeof users)[number] }) => {
    const role = getUserRole(item);
    const isSupervisor = role === "SUPERVISOR";

    return (
      <Card style={styles.personCard}>
        <View
          style={[styles.personIcon, isSupervisor && styles.supervisorIcon]}
        >
          <Ionicons
            name={isSupervisor ? "school-outline" : "person-outline"}
            size={18}
            color={isSupervisor ? "#6366F1" : Colors.primary}
          />
        </View>

        <View style={styles.personInfo}>
          <View style={styles.nameRow}>
            <AppText
              variant="body2"
              weight="semibold"
              numberOfLines={1}
              style={styles.personName}
            >
              {getUserName(item)}
            </AppText>

            <View
              style={[
                styles.roleBadge,
                isSupervisor ? styles.supervisorBadge : styles.studentBadge,
              ]}
            >
              <AppText
                variant="caption"
                weight="semibold"
                style={[
                  styles.roleText,
                  isSupervisor
                    ? styles.supervisorRoleText
                    : styles.studentRoleText,
                ]}
              >
                {isSupervisor ? "Supervisor" : "Student"}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" color="secondary" numberOfLines={1}>
            {getUserDepartment(item)}
          </AppText>

          {isSupervisor && item.profile?.specialization ? (
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {item.profile.specialization}
            </AppText>
          ) : null}

          {!isSupervisor && item.profile?.level ? (
            <AppText variant="caption" color="secondary" numberOfLines={1}>
              {item.profile.level}
            </AppText>
          ) : null}
        </View>
      </Card>
    );
  };

  const renderProject = ({ item }: { item: (typeof projects)[number] }) => (
    <ProjectRepositoryCard
      project={{
        id: item.id,
        title: item.title ?? "",
        department: item.department ?? "Department unavailable",
        yearGroup: item.academicYear?.toString() ?? "Year unavailable",
        status: item.status ?? "",
        student: getProjectStudent(item),
        supervisor: getProjectSupervisor(item),
      }}
      onPress={() =>
        navigation.navigate("ProjectDetails", {
          projectId: item.id,
        })
      }
    />
  );

  const showInitialLoading = isLoading && !data;
  const showError = isError && !data;

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
        translucent={false}
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing[3],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <AppText style={styles.headerEyebrow}>UNIVERSITY ARCHIVE</AppText>

          <AppText style={styles.headerTitle} numberOfLines={1}>
            Explore
          </AppText>

          <AppText style={styles.headerSubtitle} numberOfLines={2}>
            Discover final year projects and members of the academic community.
          </AppText>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="compass-outline"
            size={25}
            color={Colors.text.inverse}
          />
        </View>
      </View>

      <View style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderProject}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View>
              <View style={styles.searchBar}>
                <View style={styles.searchIcon}>
                  <Ionicons
                    name="search-outline"
                    size={19}
                    color={Colors.primary}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Search projects, departments..."
                  placeholderTextColor={Colors.text.tertiary}
                  value={query}
                  onChangeText={setQuery}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
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
                <View style={styles.resultsTitle}>
                  <AppText variant="h5" weight="semibold">
                    {hasQuery ? "Search results" : "Explore projects"}
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    {showInitialLoading
                      ? "Searching..."
                      : showError
                        ? "Unable to load projects"
                        : hasQuery
                          ? `${projects.length} ${
                              projects.length === 1 ? "project" : "projects"
                            } found`
                          : `${projects.length} ${
                              projects.length === 1 ? "project" : "projects"
                            } available`}
                  </AppText>
                </View>

                {!showInitialLoading && !showError && (
                  <View style={styles.resultsCount}>
                    <AppText variant="caption" weight="semibold" color="accent">
                      {projects.length}
                    </AppText>
                  </View>
                )}
              </View>

              {users.length > 0 && (
                <View style={styles.peopleSection}>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleWrap}>
                      <AppText variant="h5" weight="semibold">
                        People
                      </AppText>

                      <AppText variant="caption" color="secondary">
                        Students and supervisors
                      </AppText>
                    </View>

                    <View style={styles.sectionCount}>
                      <AppText
                        variant="caption"
                        weight="semibold"
                        color="accent"
                      >
                        {users.length}
                      </AppText>
                    </View>
                  </View>

                  <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPerson}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={styles.personSeparator} />
                    )}
                  />
                </View>
              )}

              {showInitialLoading && (
                <View style={styles.loadingState}>
                  <Skeleton width="45%" height={16} />
                  <View style={styles.loadingCard}>
                    <Skeleton width={42} height={42} />
                    <View style={styles.loadingLines}>
                      <Skeleton width="70%" height={13} />
                      <Skeleton width="45%" height={11} />
                    </View>
                  </View>
                  <View style={styles.loadingCard}>
                    <Skeleton width={42} height={42} />
                    <View style={styles.loadingLines}>
                      <Skeleton width="60%" height={13} />
                      <Skeleton width="40%" height={11} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            !showInitialLoading ? (
              <View style={styles.emptyState}>
                <EmptyState
                  icon="search-outline"
                  title={
                    users.length > 0 ? "No projects found" : "No results yet"
                  }
                  description={
                    hasQuery
                      ? "Try another search term."
                      : "Projects will appear here once they are available."
                  }
                />
              </View>
            ) : null
          }
        />

        {showError && (
          <View style={styles.errorOverlay}>
            <EmptyState
              icon="cloud-offline-outline"
              title="Explore is unavailable"
              description={
                error instanceof Error
                  ? error.message
                  : "The archive could not be reached."
              }
              action={{
                label: "Try again",
                onPress: () => refetch(),
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
