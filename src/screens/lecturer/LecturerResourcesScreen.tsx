import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { AppText, Badge, EmptyState, SectionCard } from "../../components/ui";
import { DocumentCard } from "../../components/document/DocumentCard";
import { MOCK_DOCUMENTS, MOCK_COURSES } from "../../data/mock";
import { Colors, Spacing, BorderRadius } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { getCategoryLabel } from "../../utils/format.utils";
import { DocumentCategory } from "../../types/document.types";

type Nav = NativeStackNavigationProp<MainStackParamList>;

const CATEGORIES: { id: DocumentCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "lecture_note", label: "Lecture Notes" },
  { id: "assignment", label: "Assignments" },
  { id: "past_question", label: "Past Questions" },
];

export const LecturerResourcesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [activeCategory, setActiveCategory] = useState<
    DocumentCategory | "all"
  >("all");

  const myDocs = MOCK_DOCUMENTS.filter((d) => d.uploadedById === "usr-lec-001");
  const filteredDocs =
    activeCategory === "all"
      ? myDocs
      : myDocs.filter((d) => d.category === activeCategory);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText variant="h4" weight="bold">
          Resources
        </AppText>
        <TouchableOpacity
          style={styles.uploadBtn}
          accessibilityRole="button"
          accessibilityLabel="Upload resource"
        >
          <Ionicons
            name="cloud-upload-outline"
            size={18}
            color={Colors.text.inverse}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.filterChip,
              activeCategory === cat.id && styles.filterChipActive,
            ]}
            onPress={() => setActiveCategory(cat.id)}
            accessibilityRole="button"
          >
            <AppText
              variant="caption"
              weight={activeCategory === cat.id ? "semibold" : "regular"}
              color={activeCategory === cat.id ? "inverse" : "secondary"}
            >
              {cat.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filteredDocs.length === 0 ? (
          <EmptyState
            icon="document-outline"
            title="No resources"
            description="Upload your first resource to get started."
          />
        ) : (
          filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onPress={() =>
                navigation.navigate("DocumentViewer", {
                  documentId: doc.id,
                  courseId: doc.courseId,
                  title: doc.title,
                })
              }
            />
          ))
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
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  uploadBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBar: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  filterChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[10],
    gap: Spacing[3],
  },
});
