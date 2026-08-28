import React, { useState } from "react";

import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppText, Card, Button } from "../../components/ui";

import {
  useCreateProject,
  useSubmitProject,
} from "../../hooks/useSubmitProject";

import { ProjectService } from "../../api/services/project.service";

import { useAuthStore } from "../../store/auth.store";

import { extractApiError } from "../../api/client";

import { useProjectDirectory } from "../../hooks/useProjectWorkflow";

import { useCreateTag, useTags } from "../../hooks/useTags";

import { Colors, Spacing } from "../../theme";

import { MainStackParamList } from "../../navigation/types";

import { styles } from "./styles/AddProjectScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const AddProjectScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<Nav>();

  const [title, setTitle] = useState("");

  const [abstract, setAbstract] = useState("");

  const [repositoryLink, setRepositoryLink] = useState("");

  const [demoLink, setDemoLink] = useState("");

  const [supervisorId, setSupervisorId] = useState<string>();

  const [technologies, setTechnologies] = useState<string[]>([]);

  const [newTag, setNewTag] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<
    DocumentPicker.DocumentPickerAsset[]
  >([]);

  const user = useAuthStore((state) => state.user);

  const createProject = useCreateProject();

  const submitProject = useSubmitProject();

  const { data: tags = [] } = useTags();

  const createTag = useCreateTag();

  /*
   * IMPORTANT:
   *
   * useProjectDirectory does NOT return { data }.
   *
   * It returns:
   *
   * {
   *   students,
   *   supervisors,
   *   isLoading,
   *   isError
   * }
   */

  const directory = useProjectDirectory(user?.departmentId, {
    supervisors: user?.role === "student",
  });

  const toggleTechnology = (technology: string) => {
    setTechnologies((current) =>
      current.includes(technology)
        ? current.filter((item) => item !== technology)
        : [...current, technology],
    );
  };

  const choosePdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled) {
        const oversized = result.assets.find(
          (file) => file.size && file.size > 20 * 1024 * 1024,
        );

        if (oversized) {
          Alert.alert("File is too large", "Choose a PDF smaller than 20 MB.");

          return;
        }

        setSelectedFiles(result.assets);
      }
    } catch (error) {
      Alert.alert("Unable to choose PDF", extractApiError(error).message);
    }
  };

  const submit = async () => {
    const trimmedTitle = title.trim();

    const trimmedAbstract = abstract.trim();

    const trimmedRepositoryLink = repositoryLink.trim();

    if (!trimmedTitle) {
      Alert.alert(
        "Complete your project",
        "Enter a project title before submitting.",
      );

      return;
    }

    if (trimmedAbstract.length < 30) {
      Alert.alert(
        "Abstract is too short",
        "Your abstract must be at least 30 characters long.",
      );

      return;
    }

    if (!user) {
      Alert.alert(
        "Session unavailable",
        "Sign in again before submitting your project.",
      );

      return;
    }

    let stage = "project creation";

    try {
      const project = await createProject.mutateAsync({
        title: trimmedTitle,

        abstract: trimmedAbstract,

        academicYear: new Date().getFullYear(),

        department: user.departmentId ?? "",

        repoUrl: trimmedRepositoryLink || undefined,

        demoUrl: demoLink.trim() || undefined,

        supervisorId,

        tagIds: tags
          .filter((tag) => technologies.includes(tag.name))
          .map((tag) => tag.id),
      });

      if (selectedFiles.length > 0) {
        stage = "PDF upload";

        for (const file of selectedFiles) {
          await ProjectService.uploadReport(project.id, {
            uri: file.uri,

            name: file.name || `project-report-${Date.now()}.pdf`,

            mimeType: file.mimeType || "application/pdf",
          });
        }
      }

      stage = "review submission";

      await submitProject.mutateAsync(project.id);

      Alert.alert(
        "Project submitted",
        "Your project is now waiting for faculty review.",
        [
          {
            text: "Done",

            onPress: () =>
              navigation.replace("ProjectDetails", {
                projectId: project.id,
              }),
          },
        ],
      );
    } catch (error) {
      Alert.alert(`${stage} failed`, extractApiError(error).message);
    }
  };

  const isSubmitting = createProject.isPending || submitProject.isPending;

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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.inverse} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <AppText style={styles.headerEyebrow}>Final Year Project</AppText>

          <AppText style={styles.headerTitle}>Add your project</AppText>

          <AppText style={styles.headerSubtitle}>
            Submit your project to the university resource hub.
          </AppText>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={Colors.primary}
            />
          </View>

          <View style={styles.infoContent}>
            <AppText variant="body2" weight="semibold">
              Your project will be reviewed
            </AppText>

            <AppText variant="caption" color="secondary">
              After submission, a faculty member will verify your project before
              it becomes available in the resource explorer.
            </AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Project Information
          </AppText>

          <Card style={styles.formCard}>
            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Project title
              </AppText>

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter your project title"
                placeholderTextColor={Colors.text.tertiary}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Abstract
              </AppText>

              <TextInput
                value={abstract}
                onChangeText={setAbstract}
                placeholder="Briefly describe your project, the problem it solves, and your approach."
                placeholderTextColor={Colors.text.tertiary}
                style={[styles.input, styles.textArea]}
                multiline
                textAlignVertical="top"
              />

              <AppText variant="caption" color="tertiary">
                Minimum 30 characters.
              </AppText>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Academic Information
          </AppText>

          <Card style={styles.formCard}>
            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Department
              </AppText>

              <View style={styles.selectField}>
                <View style={styles.selectIcon}>
                  <Ionicons
                    name="school-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.selectContent}>
                  <AppText variant="body2">Computer Science</AppText>

                  <AppText variant="caption" color="secondary">
                    Your registered department
                  </AppText>
                </View>

                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={Colors.text.tertiary}
                />
              </View>
            </View>

            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Academic year
              </AppText>

              <View style={styles.selectField}>
                <View style={styles.selectIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.selectContent}>
                  <AppText variant="body2">{new Date().getFullYear()}</AppText>

                  <AppText variant="caption" color="secondary">
                    Final year submission
                  </AppText>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={Colors.text.tertiary}
                />
              </View>
            </View>

            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Supervisor
              </AppText>

              {directory.isLoading && directory.supervisors.length === 0 && (
                <AppText variant="caption" color="secondary">
                  Loading available supervisors...
                </AppText>
              )}

              {!directory.isLoading &&
                directory.supervisors.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.selectField,

                      supervisorId === item.id && styles.tagSelected,
                    ]}
                    onPress={() => setSupervisorId(item.id)}
                  >
                    <View style={styles.selectContent}>
                      <AppText variant="body2">
                        {item.fullName ??
                          item.name ??
                          item.email ??
                          "Supervisor"}
                      </AppText>

                      <AppText variant="caption" color="secondary">
                        {item.department ?? "Available supervisor"}
                      </AppText>
                    </View>

                    <Ionicons
                      name={
                        supervisorId === item.id
                          ? "checkmark-circle"
                          : "chevron-forward"
                      }
                      size={18}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                ))}

              {!directory.isLoading && directory.supervisors.length === 0 && (
                <AppText variant="caption" color="secondary">
                  No supervisors available.
                </AppText>
              )}

              {directory.isError && (
                <AppText variant="caption" color="error">
                  We could not load supervisors. Please try again.
                </AppText>
              )}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Technology Stack
          </AppText>

          <Card style={styles.formCard}>
            <AppText
              variant="caption"
              color="secondary"
              style={styles.fieldHint}
            >
              Select the technologies used in your project.
            </AppText>

            <View style={styles.tags}>
              {tags.map((tag) => {
                const selected = technologies.includes(tag.name);

                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.tag, selected && styles.tagSelected]}
                    onPress={() => toggleTechnology(tag.name)}
                  >
                    <AppText
                      variant="caption"
                      weight={selected ? "semibold" : "medium"}
                      style={selected ? styles.tagSelectedText : undefined}
                    >
                      {tag.name}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.newTagRow}>
              <TextInput
                value={newTag}
                onChangeText={setNewTag}
                placeholder="Create a new tag"
                placeholderTextColor={Colors.text.tertiary}
                style={[styles.input, styles.newTagInput]}
              />

              <Button
                label="Add"
                size="sm"
                variant="outline"
                isLoading={createTag.isPending}
                onPress={async () => {
                  if (!newTag.trim()) {
                    return;
                  }

                  const tag = await createTag.mutateAsync({
                    name: newTag.trim(),
                  });

                  setTechnologies((current) => [...current, tag.name]);

                  setNewTag("");
                }}
              />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Project Documents
          </AppText>

          <Card style={styles.formCard}>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={choosePdf}
              activeOpacity={0.8}
            >
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={26}
                  color={Colors.primary}
                />
              </View>

              <AppText variant="body2" weight="semibold" numberOfLines={1}>
                {selectedFiles.length
                  ? `${selectedFiles.length} PDF${
                      selectedFiles.length === 1 ? "" : "s"
                    } selected`
                  : "Upload project reports"}
              </AppText>

              <AppText variant="caption" color="secondary">
                {selectedFiles.length
                  ? selectedFiles.map((file) => file.name).join(", ")
                  : "PDF only · Maximum file size 20 MB each"}
              </AppText>

              {selectedFiles.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSelectedFiles([])}
                  accessibilityRole="button"
                  accessibilityLabel="Remove selected PDFs"
                >
                  <AppText variant="caption" color="error" weight="semibold">
                    Remove selected files
                  </AppText>
                </TouchableOpacity>
              )}

              <View style={styles.uploadButton}>
                <AppText variant="caption" weight="semibold" color="inverse">
                  {selectedFiles.length ? "Change PDFs" : "Choose PDFs"}
                </AppText>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Repository link
              </AppText>

              <TextInput
                value={repositoryLink}
                onChangeText={setRepositoryLink}
                placeholder="https://github.com/..."
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="none"
                keyboardType="url"
                style={styles.input}
              />

              <AppText variant="caption" color="tertiary">
                Optional. Add a GitHub, GitLab, or other repository link.
              </AppText>
            </View>

            <View style={styles.field}>
              <AppText variant="caption" weight="semibold">
                Demo link
              </AppText>

              <TextInput
                value={demoLink}
                onChangeText={setDemoLink}
                placeholder="https://your-demo-url.com"
                placeholderTextColor={Colors.text.tertiary}
                autoCapitalize="none"
                keyboardType="url"
                style={styles.input}
              />
            </View>
          </Card>
        </View>

        <Button
          variant="primary"
          size="lg"
          label="Submit for Review"
          fullWidth
          isLoading={isSubmitting}
          onPress={submit}
          leftIcon={
            <Ionicons
              name="paper-plane-outline"
              size={18}
              color={Colors.text.inverse}
            />
          }
          style={styles.submitButton}
        />

        <AppText variant="caption" color="tertiary" style={styles.submitNote}>
          Your project will remain pending until it has been reviewed by
          faculty.
        </AppText>

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
