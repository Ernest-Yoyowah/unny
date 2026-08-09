import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, EmptyState } from "../../components/ui";
import { MOCK_DOCUMENTS } from "../../data/mock";
import { Colors, Spacing, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { DocumentCard } from "@/components/document/ProjectDocumentCard";

type Props = NativeStackScreenProps<MainStackParamList, "CourseArchive">;

export const CourseArchiveScreen: React.FC<Props> = ({ route, navigation }) => {
  const { courseId, courseTitle } = route.params;
  const insets = useSafeAreaInsets();

  const documents = MOCK_DOCUMENTS.filter((d) => d.courseId === courseId);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={22}
          color={Colors.text.primary}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        />
        <View style={styles.headerText}>
          <AppText variant="h5" weight="semibold" numberOfLines={1}>
            {courseTitle}
          </AppText>
          <AppText variant="caption" color="tertiary">
            Archived Materials
          </AppText>
        </View>
      </View>

      {documents.length === 0 ? (
        <EmptyState
          icon="archive-outline"
          title="No archived materials"
          description="This course has no archived resources."
        />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() =>
                navigation.navigate("DocumentViewer", {
                  documentId: item.id,
                  courseId: item.courseId,
                  title: item.title,
                })
              }
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[5],
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
  },
  separator: {
    height: Spacing[3],
  },
});
