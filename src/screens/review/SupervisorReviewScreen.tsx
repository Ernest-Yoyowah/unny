import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import {
  useApproveProject,
  useCommentOnProject,
  useRejectProject,
  useRequestProjectChanges,
  useReviewQueue,
} from "../../hooks/useSupervision";
import { Project } from "@/api/services/project.service";
import { ReviewAction } from "@/api/services/supervision.service";

type Nav = NativeStackNavigationProp<MainStackParamList>;

type ReviewModalState = {
  visible: boolean;
  action: ReviewAction;
  project: Project | null;
};

const ACTION_CONFIG: Record<
  ReviewAction,
  {
    title: string;
    description: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
  }
> = {
  COMMENTED: {
    title: "Add comment",
    description:
      "Send feedback to the student without changing the project status.",
    icon: "chatbubble-ellipses-outline",
    color: Colors.primary,
  },
  CHANGES_REQUESTED: {
    title: "Request changes",
    description: "Ask the student to make changes and resubmit.",
    icon: "create-outline",
    color: "#D97706",
  },
  REJECTED: {
    title: "Reject project",
    description: "Reject the current submission and provide a reason.",
    icon: "close-circle-outline",
    color: "#DC2626",
  },
  APPROVED: {
    title: "Approve project",
    description: "Approve the current project submission.",
    icon: "checkmark-circle-outline",
    color: "#16A34A",
  },
};

export const SupervisorReviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();

  const { data: projects, isLoading, isError, refetch } = useReviewQueue();

  const commentMutation = useCommentOnProject();
  const approveMutation = useApproveProject();
  const rejectMutation = useRejectProject();
  const changesMutation = useRequestProjectChanges();

  const [modal, setModal] = useState<ReviewModalState>({
    visible: false,
    action: "COMMENTED",
    project: null,
  });

  const [comment, setComment] = useState("");

  const isSubmitting =
    commentMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending ||
    changesMutation.isPending;

  const reviewCount = projects?.length ?? 0;

  const pendingLabel = useMemo(() => {
    if (reviewCount === 0) {
      return "No pending reviews";
    }

    return `${reviewCount} ${
      reviewCount === 1 ? "project needs" : "projects need"
    } your attention`;
  }, [reviewCount]);

  const openReview = (project: Project, action: ReviewAction) => {
    setComment("");
    setModal({
      visible: true,
      action,
      project,
    });
  };

  const closeReview = () => {
    if (isSubmitting) {
      return;
    }

    setModal({
      visible: false,
      action: "COMMENTED",
      project: null,
    });

    setComment("");
  };

  const submitReview = async () => {
    if (!modal.project) {
      return;
    }

    const projectId = modal.project.id;
    const trimmedComment = comment.trim();

    if (
      modal.action !== "COMMENTED" &&
      modal.action !== "APPROVED" &&
      !trimmedComment
    ) {
      return;
    }

    if (modal.action === "COMMENTED") {
      if (!trimmedComment) {
        return;
      }

      await commentMutation.mutateAsync({
        projectId,
        comment: trimmedComment,
      });
    }

    if (modal.action === "APPROVED") {
      await approveMutation.mutateAsync({
        projectId,
        comment: trimmedComment || undefined,
      });
    }

    if (modal.action === "REJECTED") {
      await rejectMutation.mutateAsync({
        projectId,
        comment: trimmedComment || undefined,
      });
    }

    if (modal.action === "CHANGES_REQUESTED") {
      await changesMutation.mutateAsync({
        projectId,
        comment: trimmedComment,
      });
    }

    closeReview();
  };

  const openProject = (projectId: string) => {
    navigation.navigate("ProjectDetails", {
      projectId,
    });
  };

  const renderProject = ({ item }: { item: Project }) => {
    const student =
      item.submittedBy?.fullName ??
      item.submittedBy?.email ??
      "Student unavailable";

    const progress = Math.max(0, Math.min(100, Number(item.progress ?? 0)));

    return (
      <Card style={styles.projectCard}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => openProject(item.id)}
          style={styles.projectMain}
        >
          <View style={styles.projectTop}>
            <View style={styles.projectIcon}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color={Colors.primary}
              />
            </View>

            <View style={styles.projectStatus}>
              <View style={styles.statusDot} />

              <AppText
                variant="caption"
                color="accent"
                weight="semibold"
                numberOfLines={1}
              >
                {item.status || "Pending review"}
              </AppText>
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={19}
              color={Colors.text.tertiary}
            />
          </View>

          <AppText
            variant="h5"
            weight="bold"
            numberOfLines={2}
            style={styles.projectTitle}
          >
            {item.title}
          </AppText>

          <View style={styles.studentRow}>
            <View style={styles.studentIcon}>
              <Ionicons
                name="person-outline"
                size={14}
                color={Colors.text.secondary}
              />
            </View>

            <View style={styles.studentContent}>
              <AppText variant="caption" color="tertiary">
                Student
              </AppText>

              <AppText
                variant="caption"
                color="secondary"
                weight="medium"
                numberOfLines={1}
              >
                {student}
              </AppText>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <AppText variant="caption" color="tertiary">
                Department
              </AppText>

              <AppText
                variant="caption"
                color="secondary"
                weight="medium"
                numberOfLines={1}
              >
                {item.department || "Unavailable"}
              </AppText>
            </View>

            <View style={styles.metaItem}>
              <AppText variant="caption" color="tertiary">
                Academic year
              </AppText>

              <AppText
                variant="caption"
                color="secondary"
                weight="medium"
                numberOfLines={1}
              >
                {item.academicYear || "Unavailable"}
              </AppText>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <AppText variant="caption" color="secondary">
                Project progress
              </AppText>

              <AppText variant="caption" color="accent" weight="bold">
                {progress}%
              </AppText>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>

          {item.abstract ? (
            <View style={styles.abstract}>
              <AppText variant="caption" color="secondary" numberOfLines={3}>
                {item.abstract}
              </AppText>
            </View>
          ) : null}
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionButton}
            onPress={() => openReview(item, "COMMENTED")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={17}
              color={Colors.primary}
            />

            <AppText
              variant="caption"
              weight="semibold"
              style={styles.actionText}
            >
              Comment
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.changeButton]}
            onPress={() => openReview(item, "CHANGES_REQUESTED")}
          >
            <Ionicons name="create-outline" size={17} color="#D97706" />

            <AppText
              variant="caption"
              weight="semibold"
              style={[styles.actionText, { color: "#D97706" }]}
            >
              Changes
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => openReview(item, "APPROVED")}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={17}
              color="#16A34A"
            />

            <AppText
              variant="caption"
              weight="semibold"
              style={[styles.actionText, { color: "#16A34A" }]}
            >
              Approve
            </AppText>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return <ScreenSkeleton />;
  }

  return (
    <View style={styles.container}>
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
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <AppText style={styles.headerEyebrow}>SUPERVISOR WORKSPACE</AppText>

            <AppText style={styles.headerTitle}>Review Projects</AppText>

            <AppText style={styles.headerSubtitle}>
              Review submissions, give feedback, and keep your students moving
              forward.
            </AppText>
          </View>

          <View style={styles.countCard}>
            <AppText style={styles.countNumber}>{reviewCount}</AppText>

            <AppText style={styles.countLabel}>Pending</AppText>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {isError ? (
          <View style={styles.errorContainer}>
            <EmptyState
              icon="cloud-offline-outline"
              title="Unable to load reviews"
              description="We couldn't load the projects waiting for your review."
              action={{
                label: "Try again",
                onPress: () => refetch(),
              }}
            />
          </View>
        ) : !projects || projects.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="checkmark-done-outline"
              title="You're all caught up"
              description="There are no projects waiting for your review right now."
            />
          </View>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={renderProject}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              {
                paddingBottom: insets.bottom + Spacing[8],
              },
            ]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <View>
                  <AppText variant="h5" weight="semibold" numberOfLines={1}>
                    Pending reviews
                  </AppText>

                  <AppText
                    variant="caption"
                    color="secondary"
                    numberOfLines={2}
                    style={styles.listSubtitle}
                  >
                    {pendingLabel}
                  </AppText>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.refreshButton}
                  onPress={() => refetch()}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={19}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            }
          />
        )}
      </View>

      <Modal
        visible={modal.visible}
        transparent
        animationType="slide"
        onRequestClose={closeReview}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                paddingBottom: insets.bottom + Spacing[5],
              },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalIcon,
                  {
                    backgroundColor: `${ACTION_CONFIG[modal.action].color}15`,
                  },
                ]}
              >
                <Ionicons
                  name={ACTION_CONFIG[modal.action].icon}
                  size={22}
                  color={ACTION_CONFIG[modal.action].color}
                />
              </View>

              <View style={styles.modalTitleContainer}>
                <AppText variant="h5" weight="bold">
                  {ACTION_CONFIG[modal.action].title}
                </AppText>

                <AppText variant="caption" color="secondary" numberOfLines={2}>
                  {modal.project?.title}
                </AppText>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeReview}
                disabled={isSubmitting}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <AppText
              variant="body2"
              color="secondary"
              style={styles.modalDescription}
            >
              {ACTION_CONFIG[modal.action].description}
            </AppText>

            <View style={styles.inputContainer}>
              <AppText
                variant="caption"
                weight="semibold"
                color="secondary"
                style={styles.inputLabel}
              >
                Feedback
              </AppText>

              <TextInput
                value={comment}
                onChangeText={setComment}
                multiline
                textAlignVertical="top"
                placeholder={
                  modal.action === "APPROVED"
                    ? "Add an optional message..."
                    : "Write your feedback..."
                }
                placeholderTextColor={Colors.text.tertiary}
                style={styles.input}
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeReview}
                disabled={isSubmitting}
                style={styles.cancelButton}
              >
                <AppText variant="caption" weight="semibold" color="secondary">
                  Cancel
                </AppText>
              </Pressable>

              <Pressable
                onPress={submitReview}
                disabled={
                  isSubmitting ||
                  (modal.action !== "APPROVED" && !comment.trim())
                }
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: ACTION_CONFIG[modal.action].color,
                  },
                  (isSubmitting ||
                    (modal.action !== "APPROVED" && !comment.trim())) &&
                    styles.submitButtonDisabled,
                ]}
              >
                {isSubmitting ? (
                  <AppText variant="caption" color="inverse" weight="semibold">
                    Saving...
                  </AppText>
                ) : (
                  <>
                    <Ionicons
                      name={ACTION_CONFIG[modal.action].icon}
                      size={17}
                      color={Colors.text.inverse}
                    />

                    <AppText
                      variant="caption"
                      color="inverse"
                      weight="semibold"
                    >
                      {modal.action === "COMMENTED"
                        ? "Send comment"
                        : modal.action === "CHANGES_REQUESTED"
                          ? "Request changes"
                          : modal.action === "REJECTED"
                            ? "Reject"
                            : "Approve"}
                    </AppText>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[6],
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[4],
  },

  headerCopy: {
    flex: 1,
  },

  headerEyebrow: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 1.2,
    opacity: 0.75,
    marginBottom: Spacing[1],
  },

  headerTitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing[1],
  },

  headerSubtitle: {
    color: Colors.text.inverse,
    fontSize: Typography.size.sm,
    lineHeight: 20,
    opacity: 0.82,
  },

  countCard: {
    minWidth: 72,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  countNumber: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },

  countLabel: {
    color: Colors.text.inverse,
    fontSize: Typography.size.xs,
    opacity: 0.8,
    marginTop: 2,
  },

  content: {
    flex: 1,
  },

  list: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[4],
  },

  listSubtitle: {
    marginTop: 3,
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.light,
  },

  projectCard: {
    overflow: "hidden",
  },

  projectMain: {
    padding: Spacing[4],
  },

  projectTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[3],
  },

  projectIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },

  projectStatus: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: Spacing[3],
    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },

  projectTitle: {
    marginBottom: Spacing[4],
  },

  studentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[4],
  },

  studentIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing[2],
  },

  studentContent: {
    flex: 1,
  },

  metaGrid: {
    flexDirection: "row",
    gap: Spacing[4],
    marginBottom: Spacing[4],
  },

  metaItem: {
    flex: 1,
  },

  progressSection: {
    marginBottom: Spacing[3],
  },

  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },

  progressTrack: {
    height: 7,
    borderRadius: 5,
    backgroundColor: Colors.border.light,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  abstract: {
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background,
  },

  actionButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRightWidth: 1,
    borderRightColor: Colors.border.light,
  },

  changeButton: {
    backgroundColor: "#D9770608",
  },

  approveButton: {
    backgroundColor: "#16A34A08",
    borderRightWidth: 0,
  },

  actionText: {
    color: Colors.primary,
  },

  separator: {
    height: Spacing[3],
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing[5],
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing[5],
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing[3],
    paddingHorizontal: Spacing[5],
  },

  modalHandle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 3,
    backgroundColor: Colors.border.light,
    marginBottom: Spacing[4],
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitleContainer: {
    flex: 1,
    marginLeft: Spacing[3],
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  modalDescription: {
    marginTop: Spacing[3],
    lineHeight: 20,
  },

  inputContainer: {
    marginTop: Spacing[5],
  },

  inputLabel: {
    marginBottom: Spacing[2],
  },

  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 14,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    color: Colors.text.primary,
    backgroundColor: Colors.background,
    fontSize: Typography.size.sm,
    lineHeight: 21,
  },

  modalActions: {
    flexDirection: "row",
    gap: Spacing[3],
    marginTop: Spacing[4],
  },

  cancelButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButton: {
    flex: 1.5,
    minHeight: 50,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },
});
