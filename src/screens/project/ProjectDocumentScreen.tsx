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
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { formatBytes } from "../../utils/format.utils";
import { getCategoryLabel, getFileTypeIcon } from "../../utils/format.utils";
import { formatDate } from "../../utils/date.utils";
import { styles } from "./styles/ProjectDocumentScreen.styles";

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
