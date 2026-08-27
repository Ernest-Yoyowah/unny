import React, { useMemo, useState } from "react";
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

  const {
    data: project,
    isLoading,
    isError,
    refetch,
  } = useProject(projectId, !isDeleting);

  const currentUser = useAuthStore((state) => state.user);

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

  const availableStudents = useMemo(() => {
    const collaboratorIds = new Set(
      collaborators.map((collaborator) => collaborator.userId),
    );

    return directory.students.filter((student) => {
      if (student.id === currentUser?.id) {
        return false;
      }

      return !collaboratorIds.has(student.id);
    });
  }, [collaborators, currentUser?.id, directory.students]);

  const availableSupervisors = useMemo(() => {
    const pendingSupervisorIds = new Set(
      supervisionRequests
        .filter(
          (request) =>
            request.projectId === projectId && request.status === "PENDING",
        )
        .map((request) => request.supervisorId),
    );

    return directory.supervisors.filter((supervisor) => {
      if (supervisor.id === currentUser?.id) {
        return false;
      }

      return !pendingSupervisorIds.has(supervisor.id);
    });
  }, [currentUser?.id, directory.supervisors, projectId, supervisionRequests]);

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

    if (!title.trim()) {
      Alert.alert("Invalid title", "Please enter a project title.");
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
          onPress: () => {
            navigation.pop();
          },
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

  const handleInvite = async (userId: string) => {
    if (collaboratorActions.invite.isPending) {
      return;
    }

    try {
      await collaboratorActions.invite.mutateAsync(userId);

      Alert.alert(
        "Invitation sent",
        "The student has been invited to contribute to this project.",
      );
    } catch (error) {
      Alert.alert(
        "Invitation failed",
        error instanceof Error
          ? error.message
          : "We could not send the collaboration invitation.",
      );
    }
  };

  const handleRemoveCollaborator = (userId: string) => {
    if (collaboratorActions.remove.isPending) {
      return;
    }

    Alert.alert(
      "Remove collaborator",
      "Are you sure you want to remove this collaborator?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            collaboratorActions.remove.mutate(userId);
          },
        },
      ],
    );
  };

  const handleAcceptInvite = (id: string) => {
    if (collaboratorActions.respond.isPending) {
      return;
    }

    collaboratorActions.respond.mutate({
      id,
      status: "ACCEPTED",
    });
  };

  const handleRequestSupervision = async (supervisorId: string) => {
    if (collaboratorActions.supervise.isPending) {
      return;
    }

    try {
      await collaboratorActions.supervise.mutateAsync({
        supervisorId,
        message: `Would you be willing to supervise ${
          project?.title ?? "this project"
        }?`,
      });

      Alert.alert(
        "Request sent",
        "Your supervision request has been sent to the supervisor.",
      );
    } catch (error) {
      Alert.alert(
        "Request failed",
        error instanceof Error
          ? error.message
          : "We could not send the supervision request.",
      );
    }
  };

  const handleSupervisionResponse = (
    id: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    if (respondToSupervision.isPending) {
      return;
    }

    respondToSupervision.mutate({
      id,
      status,
    });
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
          onPress: () => navigation.pop(),
        }}
      />
    );
  }

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
        {/* ───────────────────────── HEADER ───────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerMain}>
            <View style={styles.iconBox}>
              <Ionicons
                name="library-outline"
                size={28}
                color={Colors.primary}
              />
            </View>

            <View style={styles.titleArea}>
              {isEditing ? (
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Project title"
                  placeholderTextColor={Colors.text.tertiary}
                  style={styles.editTitle}
                  multiline
                  numberOfLines={2}
                />
              ) : (
                <AppText
                  variant="h3"
                  weight="bold"
                  numberOfLines={2}
                  style={styles.title}
                >
                  {project.title}
                </AppText>
              )}
            </View>
          </View>

          <View style={styles.status}>
            <AppText variant="caption" color="accent" weight="semibold">
              {project.status}
            </AppText>
          </View>
        </View>

        {/* ───────────────────── PROJECT INFORMATION ───────────────────── */}
        <Card style={styles.card}>
          <AppText variant="h5" weight="semibold">
            Project Information
          </AppText>

          <View style={styles.infoList}>
            <InfoRow
              icon="person-outline"
              label="Student"
              value={project.submittedBy?.fullName ?? "N/A"}
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

        {/* ───────────────────────── ABSTRACT ───────────────────────── */}
        <View style={styles.section}>
          <AppText variant="h5" weight="semibold">
            Abstract
          </AppText>

          <Card style={styles.card}>
            {isEditing ? (
              <TextInput
                value={abstract}
                onChangeText={setAbstract}
                placeholder="Project abstract"
                placeholderTextColor={Colors.text.tertiary}
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

        {/* ───────────────────────── PEOPLE ───────────────────────── */}
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
                        collaborator.user?.name ??
                        collaborator.user?.email ??
                        collaborator.userId}
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      {collaborator.status}
                    </AppText>
                  </View>

                  {collaborator.userId !== currentUser?.id && (
                    <TouchableOpacity
                      disabled={collaboratorActions.remove.isPending}
                      onPress={() =>
                        handleRemoveCollaborator(collaborator.userId)
                      }
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={20}
                        color={Colors.status.error}
                      />
                    </TouchableOpacity>
                  )}

                  {collaborator.status === "PENDING" &&
                    collaborator.userId === currentUser?.id && (
                      <TouchableOpacity
                        disabled={collaboratorActions.respond.isPending}
                        onPress={() => handleAcceptInvite(collaborator.id)}
                      >
                        <AppText
                          variant="caption"
                          color="accent"
                          weight="semibold"
                        >
                          Accept invite
                        </AppText>
                      </TouchableOpacity>
                    )}
                </View>
              ))
            )}

            {currentUser?.role === "student" && (
              <View style={styles.directorySection}>
                <View style={styles.directoryHeader}>
                  <View style={styles.directoryHeaderContent}>
                    <AppText variant="body2" weight="semibold">
                      Invite collaborators
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      Invite another student to contribute to this project.
                    </AppText>
                  </View>

                  <View style={styles.directoryHeaderIcon}>
                    <Ionicons
                      name="people-outline"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                </View>

                {directory.isLoading ? (
                  <View style={styles.directoryLoading}>
                    <ActivityIndicator size="small" color={Colors.primary} />

                    <AppText variant="caption" color="secondary">
                      Finding students...
                    </AppText>
                  </View>
                ) : directory.isError && availableStudents.length === 0 ? (
                  <AppText
                    variant="caption"
                    color="secondary"
                    style={styles.peopleHint}
                  >
                    We could not load students right now.
                  </AppText>
                ) : availableStudents.length === 0 ? (
                  <AppText
                    variant="caption"
                    color="secondary"
                    style={styles.peopleHint}
                  >
                    No other students are currently available to invite.
                  </AppText>
                ) : (
                  availableStudents.map((student) => {
                    const studentName =
                      student.fullName ??
                      student.profile?.fullName ??
                      student.name ??
                      student.email ??
                      "Student";

                    const studentDepartment =
                      student.department ?? student.profile?.department;

                    const studentLevel =
                      student.level ?? student.profile?.level;

                    const isInviting =
                      collaboratorActions.invite.isPending &&
                      collaboratorActions.invite.variables === student.id;

                    return (
                      <View key={student.id} style={styles.directoryCard}>
                        <View style={styles.directoryPerson}>
                          <View style={styles.avatar}>
                            <Ionicons
                              name="person-outline"
                              size={18}
                              color={Colors.primary}
                            />
                          </View>

                          <View style={styles.personDetails}>
                            <AppText variant="body2" weight="medium">
                              {studentName}
                            </AppText>

                            {student.email && (
                              <AppText variant="caption" color="secondary">
                                {student.email}
                              </AppText>
                            )}

                            {studentDepartment && (
                              <AppText variant="caption" color="secondary">
                                {studentDepartment}
                              </AppText>
                            )}

                            {studentLevel && (
                              <AppText variant="caption" color="secondary">
                                {studentLevel}
                              </AppText>
                            )}
                          </View>
                        </View>

                        <TouchableOpacity
                          disabled={collaboratorActions.invite.isPending}
                          style={[
                            styles.directoryActionButton,
                            collaboratorActions.invite.isPending &&
                              styles.directoryActionButtonDisabled,
                          ]}
                          onPress={() => handleInvite(student.id)}
                        >
                          {isInviting ? (
                            <ActivityIndicator
                              size="small"
                              color={Colors.text.inverse}
                            />
                          ) : (
                            <Ionicons
                              name="person-add-outline"
                              size={16}
                              color={Colors.text.inverse}
                            />
                          )}

                          <AppText
                            variant="caption"
                            color="inverse"
                            weight="semibold"
                          >
                            {isInviting ? "Sending..." : "Invite to contribute"}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
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
                </View>

                <AppText variant="caption" color="success">
                  Assigned
                </AppText>
              </View>
            ) : currentUser?.role === "student" ? (
              <View style={styles.directorySection}>
                <View style={styles.directoryHeader}>
                  <View style={styles.directoryHeaderContent}>
                    <AppText variant="body2" weight="semibold">
                      Find a supervisor
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      Send a supervision request to a supervisor.
                    </AppText>
                  </View>

                  <View style={styles.directoryHeaderIcon}>
                    <Ionicons
                      name="school-outline"
                      size={20}
                      color={Colors.primary}
                    />
                  </View>
                </View>

                {directory.isLoading ? (
                  <View style={styles.directoryLoading}>
                    <ActivityIndicator size="small" color={Colors.primary} />

                    <AppText variant="caption" color="secondary">
                      Finding supervisors...
                    </AppText>
                  </View>
                ) : directory.isError && availableSupervisors.length === 0 ? (
                  <AppText
                    variant="caption"
                    color="secondary"
                    style={styles.peopleHint}
                  >
                    We could not load supervisors right now.
                  </AppText>
                ) : availableSupervisors.length === 0 ? (
                  <AppText
                    variant="caption"
                    color="secondary"
                    style={styles.peopleHint}
                  >
                    No supervisors are currently available.
                  </AppText>
                ) : (
                  availableSupervisors.map((supervisor) => {
                    const supervisorName =
                      supervisor.fullName ??
                      supervisor.profile?.fullName ??
                      supervisor.name ??
                      supervisor.email ??
                      "Supervisor";

                    const supervisorDepartment =
                      supervisor.department ?? supervisor.profile?.department;

                    const specialization =
                      supervisor.specialization ??
                      supervisor.profile?.specialization;

                    const staffId = supervisor.profile?.staffId;

                    const isRequesting =
                      collaboratorActions.supervise.isPending &&
                      collaboratorActions.supervise.variables?.supervisorId ===
                        supervisor.id;

                    return (
                      <View key={supervisor.id} style={styles.directoryCard}>
                        <View style={styles.directoryPerson}>
                          <View style={styles.supervisorAvatar}>
                            <Ionicons
                              name="school-outline"
                              size={18}
                              color={Colors.accent}
                            />
                          </View>

                          <View style={styles.personDetails}>
                            <AppText variant="body2" weight="medium">
                              {supervisorName}
                            </AppText>

                            {supervisor.email && (
                              <AppText variant="caption" color="secondary">
                                {supervisor.email}
                              </AppText>
                            )}

                            {supervisorDepartment && (
                              <AppText variant="caption" color="secondary">
                                {supervisorDepartment}
                              </AppText>
                            )}

                            {specialization && (
                              <AppText variant="caption" color="secondary">
                                {specialization}
                              </AppText>
                            )}

                            {staffId && (
                              <AppText variant="caption" color="secondary">
                                {staffId}
                              </AppText>
                            )}
                          </View>
                        </View>

                        <TouchableOpacity
                          disabled={collaboratorActions.supervise.isPending}
                          style={[
                            styles.directoryActionButton,
                            styles.supervisionButton,
                            collaboratorActions.supervise.isPending &&
                              styles.directoryActionButtonDisabled,
                          ]}
                          onPress={() =>
                            handleRequestSupervision(supervisor.id)
                          }
                        >
                          {isRequesting ? (
                            <ActivityIndicator
                              size="small"
                              color={Colors.text.inverse}
                            />
                          ) : (
                            <Ionicons
                              name="send-outline"
                              size={16}
                              color={Colors.text.inverse}
                            />
                          )}

                          <AppText
                            variant="caption"
                            color="inverse"
                            weight="semibold"
                          >
                            {isRequesting
                              ? "Sending..."
                              : "Request to supervise"}
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    );
                  })
                )}
              </View>
            ) : (
              <AppText
                variant="caption"
                color="secondary"
                style={styles.peopleHint}
              >
                No supervisor assigned.
              </AppText>
            )}

            {supervisionRequests
              .filter((request) => request.projectId === projectId)
              .map((request) => (
                <View key={request.id} style={styles.personRow}>
                  <View style={styles.personDetails}>
                    <AppText variant="body2">
                      {request.supervisor?.fullName ??
                        request.supervisor?.name ??
                        request.supervisor?.email ??
                        request.supervisorId}
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      Request status: {request.status}
                    </AppText>
                  </View>

                  {canRespondToSupervision && request.status === "PENDING" && (
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        disabled={respondToSupervision.isPending}
                        onPress={() =>
                          handleSupervisionResponse(request.id, "ACCEPTED")
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
                        disabled={respondToSupervision.isPending}
                        onPress={() =>
                          handleSupervisionResponse(request.id, "REJECTED")
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

        {/* ───────────────────────── ACTIONS ───────────────────────── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            disabled={isDeleting || actions.bookmark.isPending}
            style={styles.actionButton}
            onPress={() => actions.bookmark.mutate()}
          >
            {actions.bookmark.isPending ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons
                name="bookmark-outline"
                size={18}
                color={Colors.primary}
              />
            )}

            <AppText variant="caption" weight="semibold">
              {actions.bookmark.isPending ? "Saving..." : "Bookmark"}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isDeleting || actions.update.isPending}
            style={styles.actionButton}
            onPress={isEditing ? saveChanges : beginEditing}
          >
            {actions.update.isPending ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons
                name={isEditing ? "checkmark-outline" : "create-outline"}
                size={18}
                color={Colors.primary}
              />
            )}

            <AppText variant="caption" weight="semibold">
              {actions.update.isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Edit project"}
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

        {/* ───────────────────────── DISCUSSION ───────────────────────── */}
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

            <TouchableOpacity
              disabled={!comment.trim() || actions.comment.isPending}
              style={[
                styles.commentButton,
                (!comment.trim() || actions.comment.isPending) &&
                  styles.commentButtonDisabled,
              ]}
              onPress={addComment}
            >
              {actions.comment.isPending ? (
                <ActivityIndicator size="small" color={Colors.text.inverse} />
              ) : (
                <AppText variant="caption" color="inverse" weight="semibold">
                  Post comment
                </AppText>
              )}
            </TouchableOpacity>

            {reviews.map((review) => (
              <View key={review.id} style={styles.review}>
                <AppText variant="caption" color="secondary">
                  {review.reviewer?.fullName ??
                    review.reviewer?.name ??
                    review.action}
                </AppText>

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
}) => {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={Colors.accent} />

      <View style={styles.infoContent}>
        <AppText variant="caption" color="secondary">
          {label}
        </AppText>

        <AppText variant="body2" weight="medium">
          {value || "Not provided"}
        </AppText>
      </View>
    </View>
  );
};

const DocumentRow = ({
  title,
  type,
  onPress,
}: {
  title: string;
  type: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.documentRow} onPress={onPress}>
      <Ionicons name="document-text-outline" size={20} color={Colors.primary} />

      <View style={styles.documentContent}>
        <AppText variant="body2">{title}</AppText>

        <AppText variant="caption" color="secondary">
          {type}
        </AppText>
      </View>

      <Ionicons name="download-outline" size={20} color={Colors.accent} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "red",
  },

  container: {
    flex: 1,
    backgroundColor: Colors.background,
    marginTop: -Spacing[8],
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: "hidden",
  },

  content: {
    padding: Spacing[5],
    paddingBottom: Spacing[12],
  },

  header: {
    minHeight: 178,
    marginBottom: Spacing[6],
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

  headerMain: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
  },

  iconBox: {
    width: 60,
    height: 60,
    flexShrink: 0,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primaryDim,
    justifyContent: "center",
    alignItems: "center",
  },

  titleArea: {
    flex: 1,
    minHeight: 64,
    marginLeft: Spacing[4],
    justifyContent: "center",
  },

  title: {
    lineHeight: 32,
  },

  editTitle: {
    width: "100%",
    minHeight: 64,
    maxHeight: 72,
    borderWidth: 1,
    borderColor: Colors.border.strong,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    color: Colors.text.primary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    textAlignVertical: "center",
  },

  status: {
    alignSelf: "flex-start",
    minHeight: 28,
    marginTop: Spacing[3],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    justifyContent: "center",
    backgroundColor: Colors.accentLight,
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

  infoContent: {
    flex: 1,
  },

  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    paddingVertical: Spacing[3],
  },

  documentContent: {
    flex: 1,
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
    minHeight: 42,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  commentButtonDisabled: {
    opacity: 0.5,
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
    marginTop: Spacing[5],
  },

  directoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },

  directoryHeaderContent: {
    flex: 1,
    gap: Spacing[1],
  },

  directoryHeaderIcon: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  directoryLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },

  directoryCard: {
    marginTop: Spacing[3],
    padding: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    gap: Spacing[3],
  },

  directoryPerson: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDim,
    alignItems: "center",
    justifyContent: "center",
  },

  supervisorAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },

  directoryActionButton: {
    minHeight: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },

  supervisionButton: {
    backgroundColor: Colors.accent,
  },

  directoryActionButtonDisabled: {
    opacity: 0.6,
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing[3],
    marginTop: Spacing[3],
    paddingVertical: Spacing[2],
  },

  personDetails: {
    flex: 1,
    gap: Spacing[1],
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
