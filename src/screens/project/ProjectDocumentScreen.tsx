import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Divider, SectionCard, Button } from "../../components/ui";
import { ScreenSkeleton } from "../../components/ui";
import { useProject } from "../../hooks/useProject";
import { Colors, Spacing, BorderRadius, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatBytes } from "../../utils/format.utils";
import { getCategoryLabel, getFileTypeIcon } from "../../utils/format.utils";
import { formatDate } from "../../utils/date.utils";

type Props = NativeStackScreenProps<MainStackParamList, "DocumentViewer">;

export const DocumentViewerScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { documentId, courseId, projectId, title } = route.params;
  const insets = useSafeAreaInsets();
  const { data: project, isLoading } = useProject(projectId ?? courseId ?? "");

  const source = project?.documents?.find((item) => item.id === documentId);
  const document = source
    ? {
        title: source.name ?? source.title ?? title,
        description: undefined,
        fileType: source.type ?? "file",
        fileSize: 0,
        uploadedAt:
          project?.updatedAt ?? project?.createdAt ?? new Date().toISOString(),
        downloadCount: 0,
        downloadUrl: source.url,
        category: "supplementary" as const,
        week: undefined,
      }
    : undefined;

  if (isLoading) return <ScreenSkeleton />;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <AppText
          variant="body2"
          weight="semibold"
          numberOfLines={1}
          style={styles.headerTitle}
        >
          {title}
        </AppText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {document ? (
          <>
            <View style={styles.docIcon}>
              <Ionicons
                name={
                  getFileTypeIcon(
                    document.fileType,
                  ) as keyof typeof Ionicons.glyphMap
                }
                size={44}
                color={Colors.accent}
              />
            </View>

            <View style={styles.docTitleBlock}>
              <AppText variant="h4" weight="bold" style={styles.docTitle}>
                {document.title}
              </AppText>
              {document.description && (
                <AppText
                  variant="body2"
                  color="secondary"
                  style={styles.docDesc}
                >
                  {document.description}
                </AppText>
              )}
            </View>

            <SectionCard style={styles.metaCard}>
              {[
                {
                  label: "Category",
                  value: getCategoryLabel(document.category),
                },
                { label: "File Type", value: document.fileType.toUpperCase() },
                { label: "File Size", value: formatBytes(document.fileSize) },
                {
                  label: "Uploaded",
                  value: formatDate(document.uploadedAt),
                },
                { label: "Downloads", value: String(document.downloadCount) },
              ].map((item, index) => (
                <View key={item.label}>
                  <View style={styles.metaRow}>
                    <AppText variant="body2" color="tertiary">
                      {item.label}
                    </AppText>
                    <AppText variant="body2" weight="medium">
                      {item.value}
                    </AppText>
                  </View>
                  {index < 4 && <Divider spacing={Spacing[3]} />}
                </View>
              ))}
            </SectionCard>

            {document.week && (
              <View style={styles.weekBadge}>
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={Colors.text.secondary}
                />
                <AppText variant="body2" color="secondary">
                  Week {document.week}
                </AppText>
              </View>
            )}

            <View style={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                label="Download"
                fullWidth
                leftIcon={
                  <Ionicons
                    name="download-outline"
                    size={18}
                    color={Colors.text.inverse}
                  />
                }
                onPress={() => {
                  if (document.downloadUrl) {
                    Linking.openURL(document.downloadUrl).catch(() => {});
                  }
                }}
              />
              <Button
                variant="outline"
                size="lg"
                label="View in Course"
                fullWidth
                // onPress={() => {
                //   navigation.replace("CourseDetails", { courseId });
                // }}
              />
            </View>
          </>
        ) : (
          <View style={styles.notFound}>
            <Ionicons
              name="document-outline"
              size={44}
              color={Colors.border.strong}
            />
            <AppText variant="body1" color="tertiary">
              Document not found
            </AppText>
          </View>
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
    paddingTop: Spacing[2],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: Spacing[2],
  },
  content: {
    padding: Spacing[5],
    gap: Spacing[5],
    paddingBottom: Spacing[12],
  },
  docIcon: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  docTitleBlock: {
    gap: Spacing[2],
  },
  docTitle: {
    letterSpacing: -0.3,
  },
  docDesc: {
    lineHeight: 22,
  },
  metaCard: {
    gap: 0,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing[1],
  },
  weekBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignSelf: "flex-start",
  },
  actions: {
    gap: Spacing[3],
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
    paddingTop: Spacing[20],
  },
});
