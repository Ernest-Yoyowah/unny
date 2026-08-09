import React from "react";
import { View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppText, Avatar, Card, SectionCard } from "../../components/ui";
import { useAuthStore } from "../../store/auth.store";
import {
  MOCK_STUDENT,
  MOCK_NOTIFICATIONS,
  MOCK_FINAL_YEAR_PROJECT,
} from "../../data/mock";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./StudentDashboardScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

const UNREAD_COUNT = MOCK_NOTIFICATIONS.filter((item) => !item.isRead).length;

export const StudentDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const user = useAuthStore((state) => state.user) ?? MOCK_STUDENT;

  const project = MOCK_FINAL_YEAR_PROJECT;

  const greeting = (() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";

    return "Good evening";
  })();

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.primary}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing[3],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <AppText style={styles.greetingText}>{greeting},</AppText>

          <AppText style={styles.headerName} numberOfLines={1}>
            {user.fullName.split(" ")[0]}
          </AppText>

          <View style={styles.orgRow}>
            <Ionicons
              name="school-outline"
              size={13}
              color="rgba(255,255,255,0.55)"
            />

            <AppText style={styles.orgName} numberOfLines={1}>
              {user.organizationName}
            </AppText>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={Colors.text.inverse}
            />

            {UNREAD_COUNT > 0 && <View style={styles.notifDot} />}
          </TouchableOpacity>

          <Avatar name={user.fullName} uri={user.avatarUrl} size="md" />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons
              name="folder-open-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>1</AppText>

            <AppText style={styles.statLbl}>Project</AppText>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>{project.documents.length}</AppText>

            <AppText style={styles.statLbl}>Documents</AppText>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={Colors.accent}
            />

            <AppText style={styles.statNum}>{UNREAD_COUNT}</AppText>

            <AppText style={styles.statLbl}>Alerts</AppText>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h5" weight="semibold">
              My Final Year Project
            </AppText>

            <TouchableOpacity
              style={styles.addProjectButton}
              onPress={() => navigation.navigate("AddProject")}
            >
              <Ionicons name="add" size={16} color={Colors.primary} />

              <AppText variant="caption" color="accent" weight="semibold">
                Add Project
              </AppText>
            </TouchableOpacity>
          </View>

          <Card style={styles.projectCard}>
            <View style={styles.projectTop}>
              <View style={styles.projectIcon}>
                <Ionicons
                  name="rocket-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.projectStatus}>
                <AppText variant="caption" color="accent" weight="semibold">
                  {project.status}
                </AppText>
              </View>
            </View>

            <AppText variant="h5" weight="bold" style={styles.projectTitle}>
              {project.title}
            </AppText>

            <View style={styles.projectMeta}>
              <View style={styles.metaRow}>
                <Ionicons
                  name="school-outline"
                  size={15}
                  color={Colors.text.secondary}
                />

                <AppText variant="caption" color="secondary">
                  {project.department}
                </AppText>
              </View>

              <View style={styles.metaRow}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={Colors.text.secondary}
                />

                <AppText variant="caption" color="secondary">
                  {project.yearGroup}
                </AppText>
              </View>
            </View>

            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <AppText variant="caption" color="secondary">
                  Completion
                </AppText>

                <AppText variant="caption" weight="semibold">
                  {project.progress}%
                </AppText>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${project.progress}%`,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.supervisorRow}>
              <Ionicons name="person-outline" size={16} color={Colors.accent} />

              <AppText variant="body2">
                Supervisor: {project.supervisor.name}
              </AppText>
            </View>
          </Card>
        </View>
        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Project Workspace
          </AppText>

          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("ProjectDocuments", {
                  projectId: project.id,
                })
              }
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={Colors.primary}
              />

              <AppText variant="caption" weight="semibold">
                Documents
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("ProjectTimeline", {
                  projectId: project.id,
                })
              }
            >
              <Ionicons name="time-outline" size={22} color={Colors.primary} />

              <AppText variant="caption" weight="semibold">
                Timeline
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() =>
                navigation.navigate("ProjectDetails", {
                  projectId: project.id,
                })
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Colors.primary}
              />

              <AppText variant="caption" weight="semibold">
                Details
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="h5" weight="semibold">
              Recent Project Files
            </AppText>
          </View>

          <SectionCard style={styles.filesCard}>
            {project.documents.map((document, index) => (
              <View key={document.id}>
                <TouchableOpacity
                  style={styles.fileRow}
                  onPress={() =>
                    navigation.navigate("DocumentViewer", {
                      documentId: document.id,
                      courseId: project.id,
                      title: document.title,
                    })
                  }
                >
                  <View style={styles.fileIcon}>
                    <Ionicons
                      name="document-outline"
                      size={18}
                      color={Colors.accent}
                    />
                  </View>

                  <View style={styles.fileContent}>
                    <AppText variant="body2" weight="medium" numberOfLines={1}>
                      {document.title}
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      {document.type}
                    </AppText>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={Colors.text.tertiary}
                  />
                </TouchableOpacity>

                {index < project.documents.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </SectionCard>
        </View>
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
