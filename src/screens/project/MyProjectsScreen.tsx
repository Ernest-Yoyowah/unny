import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Card, ProgressBar } from "../../components/ui";
import { Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { MOCK_FINAL_YEAR_PROJECT } from "../../data/mock";
import { styles } from "./MyProjectsScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const MyProjectsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const project = MOCK_FINAL_YEAR_PROJECT;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing[4],
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <AppText variant="h3" weight="bold">
          My Project
        </AppText>

        <AppText variant="body2" color="secondary" style={styles.subtitle}>
          Manage your final year project documentation and progress.
        </AppText>
      </View>

      <Card style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.iconBox}>
            <Ionicons
              name="folder-open-outline"
              size={24}
              color={styles.icon.color}
            />
          </View>

          <View style={styles.status}>
            <AppText variant="caption" color="accent" weight="semibold">
              {project.status}
            </AppText>
          </View>
        </View>

        <AppText variant="h5" weight="bold" style={styles.title}>
          {project.title}
        </AppText>

        <View style={styles.meta}>
          <View style={styles.metaRow}>
            <Ionicons
              name="school-outline"
              size={15}
              color={styles.metaIcon.color}
            />

            <AppText variant="caption" color="secondary">
              {project.department}
            </AppText>
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color={styles.metaIcon.color}
            />

            <AppText variant="caption" color="secondary">
              {project.yearGroup}
            </AppText>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <AppText variant="caption" color="secondary">
              Completion
            </AppText>

            <AppText variant="caption" weight="semibold">
              {project.progress}%
            </AppText>
          </View>

          <ProgressBar value={project.progress} />
        </View>

        <View style={styles.supervisor}>
          <Ionicons
            name="person-outline"
            size={16}
            color={styles.supervisorIcon.color}
          />

          <AppText variant="body2">{project.supervisor.name}</AppText>
        </View>
      </Card>

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
          Project Workspace
        </AppText>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("ProjectDocuments", {
                projectId: project.id,
              })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText variant="body2" weight="semibold">
              Documents
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("ProjectTimeline", {
                projectId: project.id,
              })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="time-outline"
                size={21}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText variant="body2" weight="semibold">
              Timeline
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate("ProjectDetails", {
                projectId: project.id,
              })
            }
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={21}
                color={styles.actionIconGlyph.color}
              />
            </View>

            <AppText variant="body2" weight="semibold">
              Details
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
          Project Overview
        </AppText>

        <Card style={styles.abstractCard}>
          <AppText variant="body2" color="secondary">
            {project.abstract}
          </AppText>
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={styles.infoIconGlyph.color}
            />
          </View>

          <View style={styles.infoContent}>
            <AppText variant="body2" weight="semibold">
              Keep your project updated
            </AppText>

            <AppText variant="caption" color="secondary">
              Upload your latest documents and keep your project information
              current throughout your final year.
            </AppText>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
