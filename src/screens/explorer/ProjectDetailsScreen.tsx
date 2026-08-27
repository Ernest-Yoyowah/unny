import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import { BorderRadius, Colors, Shadows, Spacing } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { useProject } from "../../hooks/useProject";
import {
  useProjectActions,
  useProjectCollaboratorActions,
  useProjectCollaborators,
  useProjectDirectory,
  useProjectReviews,
  useRespondToSupervision,
  useSupervisionRequests,
} from "../../hooks/useProjectWorkflow";
import { useAuthStore } from "../../store/auth.store";

type Props = NativeStackScreenProps<MainStackParamList, "ProjectDetails">;

export const ProjectDetailsScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { projectId } = route.params;
  const insets = useSafeAreaInsets();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [comment, setComment] = useState("");

  const currentUser = useAuthStore((state) => state.user);

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useProject(projectId, !isDeleting);

  const actions = useProjectActions(projectId);

  const { data: reviews = [] } = useProjectReviews(projectId, !isDeleting);

  const { data: collaborators = [] } = useProjectCollaborators(
    projectId,
    !isDeleting,
  );

  const { data: supervisionRequests = [] } = useSupervisionRequests();

  const respondToSupervision = useRespondToSupervision();

  const directory = useProjectDirectory(project?.department, {
    students: currentUser?.role === "student",
    supervisors: currentUser?.role === "student",
  });

  const collaboratorActions = useProjectCollaboratorActions(projectId);

  const canRespondToSupervision =
    currentUser?.role === "lecturer" || currentUser?.role === "admin";

  const beginEditing = () => {
    if (!project || isDeleting) {
      return;
    }

    setTitle(project.title);
    setAbstract(project.abstract ?? "");
    setIsEditing(true);
  };

  const saveChanges = async () => {
    if (isDeleting) {
      return;
    }

    try {
      await actions.update.mutateAsync({
        title: title.trim(),
        abstract: abstract.trim(),
      });

      setIsEditing(false);

      Alert.alert("Project updated", "Your project details have been saved.");
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const addComment = async () => {
    if (!comment.trim() || isDeleting) {
      return;
    }

    try {
      await actions.comment.mutateAsync(comment.trim());

      setComment("");
    } catch (error) {
      Alert.alert(
        "Comment failed",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const confirmDelete = () => {
    if (isDeleting || actions.remove.isPending) {
      return;
    }

    Alert.alert(
      "Delete project",
      "This project and its associated data will be permanently deleted. This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete project",
          style: "destructive",
          onPress: handleDelete,
        },
      ],
    );
  };

  const handleDelete = async () => {
    if (isDeleting || actions.remove.isPending) {
      return;
    }

    setIsDeleting(true);

    try {
      await actions.remove.mutateAsync();

      Alert.alert("Project deleted", "The project was successfully deleted.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setIsDeleting(false);

      Alert.alert(
        "Delete failed",
        error instanceof Error
          ? error.message
          : "We could not delete the project. Please try again.",
      );
    }
  };

  if (isDeleting) {
    return (
      <View style={styles.deletingScreen}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
        />

        <View style={styles.deletingCard}>
          <View style={styles.deletingIcon}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>

          <AppText variant="h4" weight="bold" style={styles.deletingTitle}>
            Deleting project
          </AppText>

          <AppText
            variant="body2"
            color="secondary"
            style={styles.deletingDescription}
          >
            Please wait while we remove the project and update your project
            list.
          </AppText>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return <ScreenSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        icon="cloud-offline-outline"
        title="Project unavailable"
        description="We could not load this project right now."
        action={{
          label: "Try again",
          onPress: () => refetch(),
        }}
      />
    );
  }

  if (!project) {
    return (
      <EmptyState
        icon="search-outline"
        title="Project not found"
        description="This project may have been deleted or is no longer available."
        action={{
          label: "Go back",
          onPress: () => navigation.goBack(),
        }}
      />
    );
  }

  const availableStudents = directory.students.filter(
    (student) =>
      student.id !== currentUser?.id &&
      !collaborators.some((collaborator) => collaborator.userId === student.id),
  );

  const availableSupervisors = directory.supervisors.filter(
    (supervisor) =>
      supervisor.id !== project.supervisor?.id &&
      !supervisionRequests.some(
        (request) =>
          request.projectId === projectId &&
          request.supervisorId === supervisor.id,
      ),
  );

  const projectSupervisionRequests = supervisionRequests.filter(
    (request) => request.projectId === projectId,
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        style={[
          styles.container,
          {
            paddingTop: insets.top,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.iconBox}>
            <Ionicons name="library-outline" size={28} color={Colors.primary} />
          </View>

          {isEditing ? (
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={styles.editTitle}
            />
          ) : (
            <AppText variant="h3" weight="bold" style={styles.title}>
              {project.title}
            </AppText>
          )}

          <View style={styles.status}>
            <AppText variant="caption" color="accent" weight="semibold">
              {project.status}
            </AppText>
          </View>
        </View>

        <Card style={styles.card}>
          <AppText variant="h5" weight="semibold">
            Project Information
          </AppText>

          <View style={styles.infoList}>
            <InfoRow
              icon="person-outline"
              label="Student"
              value={project.submittedBy?.fullName}
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
              value={project.academicYear?.toString()}
            />

            <InfoRow
              icon="person-circle-outline"
              label="Supervisor"
              value={project.supervisor?.fullName ?? project.supervisor?.name}
            />
          </View>
        </Card>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold">
            Abstract
          </AppText>

          <Card style={styles.card}>
            {isEditing ? (
              <TextInput
                value={abstract}
                onChangeText={setAbstract}
                multiline
                style={styles.editAbstract}
              />
            ) : (
              <AppText variant="body2" color="secondary">
                {project.abstract || "No abstract provided."}
              </AppText>
            )}
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold">
            People
          </AppText>

          <Card style={styles.card}>
            <AppText variant="body2" weight="semibold">
              Collaborators
            </AppText>

            {collaborators.length === 0 ? (
              <AppText
                variant="caption"
                color="secondary"
                style={styles.peopleHint}
              >
                No collaborators yet.
              </AppText>
            ) : (
              collaborators.map((collaborator) => (
                <View key={collaborator.id} style={styles.personRow}>
                  <View style={styles.personDetails}>
                    <AppText variant="body2">
                      {collaborator.user?.fullName ??
                        collaborator.user?.email ??
                        collaborator.userId}
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      {collaborator.status}
                    </AppText>
                  </View>

                  {collaborator.status === "PENDING" &&
                  collaborator.userId === currentUser?.id ? (
                    <TouchableOpacity
                      style={styles.smallAction}
                      onPress={() =>
                        collaboratorActions.respond.mutate({
                          id: collaborator.id,
                          status: "ACCEPTED",
                        })
                      }
                    >
                      <AppText
                        variant="caption"
                        color="accent"
                        weight="semibold"
                      >
                        Accept
                      </AppText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        collaboratorActions.remove.mutate(collaborator.userId)
                      }
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={20}
                        color={Colors.status.error}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}

            {currentUser?.role === "student" &&
              availableStudents.length > 0 && (
                <View style={styles.directorySection}>
                  <AppText variant="caption" color="secondary">
                    Students you can invite
                  </AppText>

                  {availableStudents.map((student) => (
                    <View key={student.id} style={styles.directoryRow}>
                      <View style={styles.personDetails}>
                        <AppText variant="body2">
                          {student.fullName ??
                            student.name ??
                            student.email ??
                            "Student"}
                        </AppText>

                        {student.department && (
                          <AppText variant="caption" color="secondary">
                            {student.department}
                          </AppText>
                        )}
                      </View>

                      <TouchableOpacity
                        disabled={collaboratorActions.invite.isPending}
                        style={styles.requestButton}
                        onPress={() =>
                          collaboratorActions.invite.mutate(student.id)
                        }
                      >
                        {collaboratorActions.invite.isPending ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.primary}
                          />
                        ) : (
                          <>
                            <Ionicons
                              name="person-add-outline"
                              size={17}
                              color={Colors.primary}
                            />

                            <AppText
                              variant="caption"
                              weight="semibold"
                              color="accent"
                            >
                              Invite
                            </AppText>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

            <View style={styles.peopleDivider} />

            <AppText variant="body2" weight="semibold">
              Supervisor
            </AppText>

            {project.supervisor ? (
              <View style={styles.personRow}>
                <View style={styles.personDetails}>
                  <AppText variant="body2">
                    {project.supervisor.fullName ??
                      project.supervisor.name ??
                      "Supervisor"}
                  </AppText>

                  <AppText variant="caption" color="success">
                    Assigned
                  </AppText>
                </View>
              </View>
            ) : (
              <>
                {availableSupervisors.length === 0 && (
                  <AppText
                    variant="caption"
                    color="secondary"
                    style={styles.peopleHint}
                  >
                    No supervisors available for this department.
                  </AppText>
                )}

                {availableSupervisors.map((supervisor) => (
                  <View key={supervisor.id} style={styles.directoryRow}>
                    <View style={styles.personDetails}>
                      <AppText variant="body2">
                        {supervisor.fullName ??
                          supervisor.name ??
                          supervisor.email ??
                          "Supervisor"}
                      </AppText>

                      {supervisor.department && (
                        <AppText variant="caption" color="secondary">
                          {supervisor.department}
                        </AppText>
                      )}
                    </View>

                    <TouchableOpacity
                      disabled={collaboratorActions.supervise.isPending}
                      style={styles.requestButton}
                      onPress={() =>
                        collaboratorActions.supervise.mutate({
                          supervisorId: supervisor.id,
                          message: `Would you be willing to supervise ${project.title}?`,
                        })
                      }
                    >
                      {collaboratorActions.supervise.isPending ? (
                        <ActivityIndicator
                          size="small"
                          color={Colors.primary}
                        />
                      ) : (
                        <>
                          <Ionicons
                            name="send-outline"
                            size={17}
                            color={Colors.primary}
                          />

                          <AppText
                            variant="caption"
                            weight="semibold"
                            color="accent"
                          >
                            Request
                          </AppText>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {projectSupervisionRequests.map((request) => (
              <View key={request.id} style={styles.personRow}>
                <View style={styles.personDetails}>
                  <AppText variant="body2">
                    {request.supervisor?.fullName ??
                      request.supervisor?.name ??
                      request.supervisorId}
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    Request status: {request.status}
                  </AppText>
                </View>

                {canRespondToSupervision && request.status === "PENDING" && (
                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      onPress={() =>
                        respondToSupervision.mutate({
                          id: request.id,
                          status: "ACCEPTED",
                        })
                      }
                    >
                      <AppText
                        variant="caption"
                        color="success"
                        weight="semibold"
                      >
                        Accept
                      </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        respondToSupervision.mutate({
                          id: request.id,
                          status: "REJECTED",
                        })
                      }
                    >
                      <AppText
                        variant="caption"
                        color="error"
                        weight="semibold"
                      >
                        Decline
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            disabled={isDeleting}
            style={styles.actionButton}
            onPress={() => actions.bookmark.mutate()}
          >
            <Ionicons
              name="bookmark-outline"
              size={18}
              color={Colors.primary}
            />

            <AppText variant="caption" weight="semibold">
              Bookmark
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isDeleting}
            style={styles.actionButton}
            onPress={isEditing ? saveChanges : beginEditing}
          >
            <Ionicons
              name={isEditing ? "checkmark-outline" : "create-outline"}
              size={18}
              color={Colors.primary}
            />

            <AppText variant="caption" weight="semibold">
              {isEditing ? "Save changes" : "Edit project"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isDeleting}
            style={[styles.actionButton, styles.deleteButton]}
            onPress={confirmDelete}
          >
            {actions.remove.isPending ? (
              <ActivityIndicator size="small" color={Colors.status.error} />
            ) : (
              <Ionicons
                name="trash-outline"
                size={18}
                color={Colors.status.error}
              />
            )}

            <AppText variant="caption" color="error" weight="semibold">
              {actions.remove.isPending ? "Deleting..." : "Delete"}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold">
            Discussion
          </AppText>

          <Card style={styles.card}>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Leave a comment for collaborators or your supervisor"
              placeholderTextColor={Colors.text.tertiary}
              multiline
              style={styles.commentInput}
            />

            <TouchableOpacity style={styles.commentButton} onPress={addComment}>
              <AppText variant="caption" color="inverse" weight="semibold">
                Post comment
              </AppText>
            </TouchableOpacity>

            {reviews.map((review) => (
              <View key={review.id} style={styles.review}>
                <AppText variant="caption" color="secondary">
                  {review.action}
                </AppText>

                <AppText variant="body2">
                  {review.comment || "Review recorded."}
                </AppText>
              </View>
            ))}

            {project.comments?.map((item) => (
              <View key={item.id} style={styles.review}>
                <AppText variant="caption" color="secondary">
                  {item.author?.fullName ?? "Project participant"}
                </AppText>

                <AppText variant="body2">{item.body}</AppText>
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <AppText variant="h5" weight="semibold">
            Project Documents
          </AppText>

          <Card style={styles.card}>
            {project.documents?.length ? (
              project.documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  title={document.name ?? document.title ?? "Project document"}
                  type={document.type ?? "FILE"}
                  onPress={() =>
                    navigation.navigate("DocumentViewer", {
                      documentId: document.id,
                      projectId,
                      title:
                        document.name ?? document.title ?? "Project document",
                    })
                  }
                />
              ))
            ) : (
              <AppText variant="body2" color="secondary">
                No documents available.
              </AppText>
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
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

const DocumentRow = ({
  title,
  type,
  onPress,
}: {
  title: string;
  type: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.documentRow} onPress={onPress}>
    <Ionicons name="document-text-outline" size={20} color={Colors.primary} />

    <View style={styles.documentInfo}>
      <AppText variant="body2">{title}</AppText>

      <AppText variant="caption" color="secondary">
        {type}
      </AppText>
    </View>

    <Ionicons name="download-outline" size={20} color={Colors.accent} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

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

  documentInfo: {
    flex: 1,
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

  editTitle: {
    marginTop: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.strong,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    color: Colors.text.primary,
    fontSize: 24,
    fontWeight: "700",
  },

  editAbstract: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    color: Colors.text.primary,
    textAlignVertical: "top",
  },

  actionsRow: {
    flexDirection: "row",
    gap: Spacing[2],
    marginTop: Spacing[6],
  },

  actionButton: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
  },

  deleteButton: {
    borderColor: Colors.status.errorBorder,
    backgroundColor: Colors.status.errorLight,
  },

  commentInput: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing[3],
    color: Colors.text.primary,
    textAlignVertical: "top",
  },

  commentButton: {
    alignSelf: "flex-end",
    marginTop: Spacing[3],
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
  },

  review: {
    marginTop: Spacing[4],
    paddingTop: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    gap: Spacing[1],
  },

  peopleHint: {
    marginTop: Spacing[2],
  },

  directorySection: {
    marginTop: Spacing[4],
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing[3],
    paddingVertical: Spacing[2],
  },

  personDetails: {
    flex: 1,
    gap: Spacing[1],
  },

  directoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing[2],
    paddingVertical: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },

  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
  },

  smallAction: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[2],
  },

  peopleDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing[5],
  },

  requestActions: {
    flexDirection: "row",
    gap: Spacing[3],
    alignItems: "center",
  },

  deletingScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing[6],
  },

  deletingCard: {
    width: "100%",
    maxWidth: 420,
    padding: Spacing[7],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surface,
    alignItems: "center",
    ...Shadows.sm,
  },

  deletingIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  deletingTitle: {
    marginTop: Spacing[5],
    textAlign: "center",
  },

  deletingDescription: {
    marginTop: Spacing[3],
    textAlign: "center",
    lineHeight: 22,
  },
});
