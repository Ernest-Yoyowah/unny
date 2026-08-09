import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppText, Card } from "../../components/ui";
import { Colors, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./AddProjectScreen.styles";

type Nav = NativeStackNavigationProp<MainStackParamList>;

export const AddProjectScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [repositoryLink, setRepositoryLink] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);

  const technologyOptions = [
    "React Native",
    "React",
    "Node.js",
    "Python",
    "Java",
    "Machine Learning",
    "Firebase",
  ];

  const toggleTechnology = (technology: string) => {
    setTechnologies((current) =>
      current.includes(technology)
        ? current.filter((item) => item !== technology)
        : [...current, technology],
    );
  };

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
                Keep your abstract clear and concise.
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
                  <AppText variant="body2">2026</AppText>

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

              <TextInput
                value={supervisor}
                onChangeText={setSupervisor}
                placeholder="Enter supervisor name"
                placeholderTextColor={Colors.text.tertiary}
                style={styles.input}
              />
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
              {technologyOptions.map((technology) => {
                const selected = technologies.includes(technology);

                return (
                  <TouchableOpacity
                    key={technology}
                    style={[styles.tag, selected && styles.tagSelected]}
                    onPress={() => toggleTechnology(technology)}
                  >
                    <AppText
                      variant="caption"
                      weight={selected ? "semibold" : "medium"}
                      style={selected ? styles.tagSelectedText : undefined}
                    >
                      {technology}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold" style={styles.sectionTitle}>
            Project Documents
          </AppText>

          <Card style={styles.formCard}>
            <TouchableOpacity style={styles.uploadBox}>
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={26}
                  color={Colors.primary}
                />
              </View>

              <AppText variant="body2" weight="semibold">
                Upload project report
              </AppText>

              <AppText variant="caption" color="secondary">
                PDF only · Maximum file size 20 MB
              </AppText>

              <View style={styles.uploadButton}>
                <AppText variant="caption" weight="semibold" color="inverse">
                  Choose PDF
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
          </Card>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color={Colors.text.inverse}
          />

          <AppText variant="body2" weight="semibold" color="inverse">
            Submit for Review
          </AppText>
        </TouchableOpacity>

        <AppText variant="caption" color="tertiary" style={styles.submitNote}>
          Your project will remain pending until it has been reviewed by
          faculty.
        </AppText>

        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};
