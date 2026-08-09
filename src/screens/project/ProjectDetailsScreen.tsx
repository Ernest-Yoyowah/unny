import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AppText, Card } from "../../components/ui";

import { Colors, Spacing, BorderRadius, Shadows } from "../../theme";

import { MainStackParamList } from "../../navigation/types";

import { MOCK_PROJECT, MOCK_PROJECTS } from "../../data/project.mock";

type Props = NativeStackScreenProps<MainStackParamList, "ProjectDetails">;

export const ProjectDetailsScreen: React.FC<Props> = ({ route }) => {
  const { projectId } = route.params;

  const project = MOCK_PROJECTS.find((item) => item.id === projectId);

  if (!project) {
    return (
      <View style={styles.empty}>
        <AppText>Project not found</AppText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity
          //   onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>

        <View style={styles.iconBox}>
          <Ionicons name="library-outline" size={28} color={Colors.primary} />
        </View>

        <AppText variant="h3" weight="bold" style={styles.title}>
          {project.title}
        </AppText>

        <View style={styles.status}>
          <AppText variant="caption" color="accent" weight="semibold">
            {project.status}
          </AppText>
        </View>
      </View>

      {/* Metadata */}

      <Card style={styles.card}>
        <AppText variant="h5" weight="semibold">
          Project Information
        </AppText>

        <View style={styles.infoList}>
          <InfoRow
            icon="person-outline"
            label="Student"
            value={project.student}
          />

          <InfoRow
            icon="school-outline"
            label="Department"
            value={project.department}
          />

          <InfoRow
            icon="book-outline"
            label="Programme"
            value="BSc Final Year Project"
          />

          <InfoRow
            icon="calendar-outline"
            label="Year"
            value={project.yearGroup}
          />

          <InfoRow
            icon="person-circle-outline"
            label="Supervisor"
            value={project.supervisor}
          />
        </View>
      </Card>

      {/* Abstract */}

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold">
          Abstract
        </AppText>

        <Card style={styles.card}>
          <AppText variant="body2" color="secondary">
            {MOCK_PROJECT.abstract}
          </AppText>
        </Card>
      </View>

      {/* Documents */}

      <View style={styles.section}>
        <AppText variant="h5" weight="semibold">
          Project Documents
        </AppText>

        <Card style={styles.card}>
          <DocumentRow title="Project Proposal.pdf" type="PDF" />

          <DocumentRow title="Final Report.pdf" type="PDF" />

          <DocumentRow title="Presentation Slides.pptx" type="PRESENTATION" />
        </Card>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={18} color={Colors.accent} />

    <View>
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>

      <AppText variant="body2" weight="medium">
        {value || "Not provided"}
      </AppText>
    </View>
  </View>
);

const DocumentRow = ({ title, type }: { title: string; type: string }) => (
  <View style={styles.documentRow}>
    <Ionicons name="document-text-outline" size={20} color={Colors.primary} />

    <View style={{ flex: 1 }}>
      <AppText variant="body2">{title}</AppText>

      <AppText variant="caption" color="secondary">
        {type}
      </AppText>
    </View>

    <Ionicons name="download-outline" size={20} color={Colors.accent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: Spacing[5],
    paddingBottom: Spacing[12],
  },

  header: {
    marginBottom: Spacing[6],
  },

  iconBox: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDim,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: Spacing[4],
    lineHeight: 32,
  },

  status: {
    alignSelf: "flex-start",
    marginTop: Spacing[3],
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.full,
  },

  card: {
    padding: Spacing[5],
    borderRadius: BorderRadius.xl,
    ...Shadows.sm,
  },

  section: {
    marginTop: Spacing[7],
  },

  infoList: {
    marginTop: Spacing[5],
    gap: Spacing[4],
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[3],
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing[4],
  },
});
