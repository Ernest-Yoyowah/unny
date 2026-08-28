import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText, Card, EmptyState, ScreenSkeleton } from "../../components/ui";
import { Colors } from "../../theme";
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
import { styles } from "./styles/ProjectDetailsScreen.styles";

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

  const isStudent = currentUser?.role === "student";
  const isSupervisor =
    currentUser?.role === "lecturer" || currentUser?.role === "admin";

  const canEdit = isStudent && project?.submittedBy?.id === currentUser?.id;
  const canDelete = isStudent && project?.submittedBy?.id === currentUser?.id;

  const projectRequests = useMemo(
    () =>
      supervisionRequests.filter((request) => request.projectId === projectId),
    [projectId, supervisionRequests],
  );

  const myPendingRequest = useMemo(
    () =>
      projectRequests.find(
        (request) =>
          request.requester?.id === currentUser?.id &&
          request.status === "PENDING",
      ),
    [currentUser?.id, projectRequests],
  );

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
    const requestedSupervisorIds = new Set(
      projectRequests
        .filter((request) => request.status === "PENDING")
        .map((request) => request.supervisorId),
    );

    return directory.supervisors.filter((supervisor) => {
      if (supervisor.id === currentUser?.id) {
        return false;
      }

      return !requestedSupervisorIds.has(supervisor.id);
    });
  }, [currentUser?.id, directory.supervisors, projectRequests]);

  const beginEditing = () => {
    if (!project || isDeleting || !canEdit) {
      return;
    }

    setTitle(project.title);
    setAbstract(project.abstract ?? "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTitle("");
    setAbstract("");
  };

  const saveChanges = async () => {
    if (isDeleting || !canEdit) {
      return;
    }

    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a project title.");
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
    if (isDeleting || actions.remove.isPending || !canDelete) {
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
    if (isDeleting || actions.remove.isPending || !canDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await actions.remove.mutateAsync();

      Alert.alert("Project deleted", "The project was successfully deleted.", [
        {
          text: "OK",
          onPress: () => navigation.pop(),
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
          onPress: () => collaboratorActions.remove.mutate(userId),
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
      <View style={styles.errorScreen}>
        <EmptyState
          icon="cloud-offline-outline"
          title="Project unavailable"
          description="We could not load this project right now."
          action={{
            label: "Try again",
            onPress: () => refetch(),
          }}
        />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorScreen}>
        <EmptyState
          icon="search-outline"
          title="Project not found"
          description="This project may have been deleted or is no longer available."
          action={{
            label: "Go back",
            onPress: () => navigation.pop(),
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View
        style={[
          styles.hero,
          {
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={styles.heroTop}>
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={21} color={Colors.text.inverse} />
          </TouchableOpacity>

          <View style={styles.heroRole}>
            <Ionicons
              name={isStudent ? "school-outline" : "people-outline"}
              size={14}
              color="rgba(255,255,255,0.75)"
            />

            <AppText style={styles.heroRoleText}>
              {isStudent ? "MY PROJECT" : "SUPERVISION"}
            </AppText>
          </View>
        </View>

        <View style={styles.heroMain}>
          <View style={styles.heroIcon}>
            <Ionicons name="library-outline" size={26} color={Colors.primary} />
          </View>

          <View style={styles.heroText}>
            <AppText style={styles.heroTitle} numberOfLines={3}>
              {project.title}
            </AppText>

            <AppText style={styles.heroSubtitle}>{project.department}</AppText>
          </View>
        </View>

        <View style={styles.heroBottom}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <AppText style={styles.statusText}>{project.status}</AppText>
          </View>

          <AppText style={styles.heroYear}>
            {project.academicYear ?? "Academic year"}
          </AppText>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + 40,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isEditing && (
          <View style={styles.editBanner}>
            <View style={styles.editBannerIcon}>
              <Ionicons
                name="create-outline"
                size={18}
                color={Colors.primary}
              />
            </View>

            <View style={styles.editBannerContent}>
              <AppText variant="body2" weight="semibold">
                Editing project
              </AppText>

              <AppText variant="caption" color="secondary">
                Update the title and abstract, then save your changes.
              </AppText>
            </View>

            <TouchableOpacity onPress={cancelEditing}>
              <AppText variant="caption" color="error" weight="semibold">
                Cancel
              </AppText>
            </TouchableOpacity>
          </View>
        )}

        {isSupervisor && (
          <Card style={styles.attentionCard}>
            <View style={styles.attentionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Colors.accent}
              />
            </View>

            <View style={styles.attentionContent}>
              <AppText variant="body2" weight="semibold">
                {project.supervisor
                  ? "Supervision assigned"
                  : "Supervision needed"}
              </AppText>

              <AppText variant="caption" color="secondary">
                {project.supervisor
                  ? "You can review the project and collaborate with the student."
                  : "This project does not currently have a supervisor assigned."}
              </AppText>
            </View>
          </Card>
        )}

        {isStudent && !project.supervisor && (
          <Card style={styles.nextStepCard}>
            <View style={styles.nextStepIcon}>
              <Ionicons name="school-outline" size={22} color={Colors.accent} />
            </View>

            <View style={styles.nextStepContent}>
              <AppText variant="body2" weight="semibold">
                Find a supervisor
              </AppText>

              <AppText variant="caption" color="secondary">
                Your project does not have a supervisor yet. Browse available
                supervisors below to send a request.
              </AppText>
            </View>

            <Ionicons
              name="arrow-down-outline"
              size={18}
              color={Colors.accent}
            />
          </Card>
        )}

        <SectionHeader
          icon="information-circle-outline"
          title="Project overview"
          description="The key details about this project."
        />

        <Card style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Student"
            value={project.submittedBy?.fullName}
          />

          <InfoRow
            icon="business-outline"
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
            label="Academic year"
            value={project.academicYear?.toString()}
          />

          <InfoRow
            icon="school-outline"
            label="Supervisor"
            value={
              project.supervisor?.fullName ??
              project.supervisor?.name ??
              "Not assigned"
            }
            last
          />
        </Card>

        <SectionHeader
          icon="document-text-outline"
          title="Abstract"
          description="A concise description of the project."
        />

        <Card style={styles.card}>
          {isEditing ? (
            <TextInput
              value={abstract}
              onChangeText={setAbstract}
              placeholder="Project abstract"
              placeholderTextColor={Colors.text.tertiary}
              multiline
              style={styles.editAbstract}
              textAlignVertical="top"
            />
          ) : (
            <AppText variant="body2" color="secondary" style={styles.bodyText}>
              {project.abstract || "No abstract provided."}
            </AppText>
          )}
        </Card>

        <SectionHeader
          icon="people-outline"
          title="People"
          description="Students and supervisors connected to this project."
        />

        <Card style={styles.card}>
          <View style={styles.subsectionHeader}>
            <View style={styles.subsectionTitleRow}>
              <View style={styles.subsectionIcon}>
                <Ionicons
                  name="people-outline"
                  size={17}
                  color={Colors.primary}
                />
              </View>

              <AppText variant="body2" weight="semibold">
                Collaborators
              </AppText>
            </View>

            <View style={styles.countBadge}>
              <AppText variant="caption" color="secondary" weight="semibold">
                {collaborators.length}
              </AppText>
            </View>
          </View>

          {collaborators.length === 0 ? (
            <View style={styles.inlineEmpty}>
              <AppText variant="caption" color="secondary">
                No collaborators yet.
              </AppText>
            </View>
          ) : (
            collaborators.map((collaborator) => (
              <View key={collaborator.id} style={styles.personRow}>
                <View style={styles.avatar}>
                  <Ionicons
                    name="person-outline"
                    size={17}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.personDetails}>
                  <AppText variant="body2" weight="medium">
                    {collaborator.user?.fullName ??
                      collaborator.user?.name ??
                      collaborator.user?.email ??
                      collaborator.userId}
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    {collaborator.status === "PENDING"
                      ? "Invitation pending"
                      : "Collaborator"}
                  </AppText>
                </View>

                {collaborator.status === "PENDING" &&
                collaborator.userId === currentUser?.id ? (
                  <TouchableOpacity
                    disabled={collaboratorActions.respond.isPending}
                    style={styles.smallPrimaryButton}
                    onPress={() => handleAcceptInvite(collaborator.id)}
                  >
                    <AppText
                      variant="caption"
                      color="inverse"
                      weight="semibold"
                    >
                      Accept
                    </AppText>
                  </TouchableOpacity>
                ) : collaborator.userId !== currentUser?.id && isStudent ? (
                  <TouchableOpacity
                    disabled={collaboratorActions.remove.isPending}
                    onPress={() =>
                      handleRemoveCollaborator(collaborator.userId)
                    }
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={21}
                      color={Colors.status.error}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            ))
          )}

          {isStudent && (
            <View style={styles.workflowBlock}>
              <View style={styles.workflowHeader}>
                <View style={styles.workflowHeaderIcon}>
                  <Ionicons
                    name="person-add-outline"
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <View style={styles.workflowHeaderContent}>
                  <AppText variant="body2" weight="semibold">
                    Add a collaborator
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    Invite another student to contribute to this project.
                  </AppText>
                </View>
              </View>

              {directory.isLoading ? (
                <LoadingRow label="Finding students..." />
              ) : directory.isError && availableStudents.length === 0 ? (
                <InlineMessage text="We could not load students right now." />
              ) : availableStudents.length === 0 ? (
                <InlineMessage text="No other students are currently available to invite." />
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

                  const studentLevel = student.level ?? student.profile?.level;

                  const isInviting =
                    collaboratorActions.invite.isPending &&
                    collaboratorActions.invite.variables === student.id;

                  return (
                    <DirectoryPerson
                      key={student.id}
                      icon="person-outline"
                      name={studentName}
                      details={
                        [studentDepartment, studentLevel].filter(
                          Boolean,
                        ) as string[]
                      }
                      actionLabel={isInviting ? "Sending..." : "Invite"}
                      loading={isInviting}
                      onPress={() => handleInvite(student.id)}
                    />
                  );
                })
              )}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.subsectionHeader}>
            <View style={styles.subsectionTitleRow}>
              <View style={styles.supervisorIcon}>
                <Ionicons
                  name="school-outline"
                  size={17}
                  color={Colors.accent}
                />
              </View>

              <AppText variant="body2" weight="semibold">
                Supervisor
              </AppText>
            </View>

            {project.supervisor && (
              <View style={styles.assignedBadge}>
                <AppText variant="caption" color="success" weight="semibold">
                  Assigned
                </AppText>
              </View>
            )}
          </View>

          {project.supervisor ? (
            <View style={styles.personRow}>
              <View style={styles.supervisorAvatar}>
                <Ionicons
                  name="school-outline"
                  size={17}
                  color={Colors.accent}
                />
              </View>

              <View style={styles.personDetails}>
                <AppText variant="body2" weight="medium">
                  {project.supervisor.fullName ??
                    project.supervisor.name ??
                    "Supervisor"}
                </AppText>

                <AppText variant="caption" color="secondary">
                  Project supervisor
                </AppText>
              </View>
            </View>
          ) : isStudent ? (
            <View style={styles.workflowBlock}>
              {myPendingRequest && (
                <View style={styles.pendingRequest}>
                  <View style={styles.pendingIcon}>
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color={Colors.accent}
                    />
                  </View>

                  <View style={styles.pendingContent}>
                    <AppText variant="body2" weight="semibold">
                      Supervisor request pending
                    </AppText>

                    <AppText variant="caption" color="secondary">
                      Waiting for{" "}
                      {myPendingRequest.supervisor?.fullName ??
                        myPendingRequest.supervisor?.name ??
                        "the supervisor"}{" "}
                      to respond.
                    </AppText>
                  </View>
                </View>
              )}

              {!myPendingRequest && (
                <>
                  <View style={styles.workflowHeader}>
                    <View style={styles.workflowHeaderIcon}>
                      <Ionicons
                        name="search-outline"
                        size={18}
                        color={Colors.accent}
                      />
                    </View>

                    <View style={styles.workflowHeaderContent}>
                      <AppText variant="body2" weight="semibold">
                        Find a supervisor
                      </AppText>

                      <AppText variant="caption" color="secondary">
                        Choose a supervisor whose expertise fits your project.
                      </AppText>
                    </View>
                  </View>

                  {directory.isLoading ? (
                    <LoadingRow label="Finding supervisors..." />
                  ) : directory.isError && availableSupervisors.length === 0 ? (
                    <InlineMessage text="We could not load supervisors right now." />
                  ) : availableSupervisors.length === 0 ? (
                    <InlineMessage text="No supervisors are currently available." />
                  ) : (
                    availableSupervisors.map((supervisor) => {
                      const supervisorName =
                        supervisor.fullName ??
                        supervisor.profile?.fullName ??
                        supervisor.name ??
                        supervisor.email ??
                        "Supervisor";

                      const specialization =
                        supervisor.specialization ??
                        supervisor.profile?.specialization;

                      const department =
                        supervisor.department ?? supervisor.profile?.department;

                      const staffId = supervisor.profile?.staffId;

                      const isRequesting =
                        collaboratorActions.supervise.isPending &&
                        collaboratorActions.supervise.variables
                          ?.supervisorId === supervisor.id;

                      return (
                        <DirectoryPerson
                          key={supervisor.id}
                          icon="school-outline"
                          name={supervisorName}
                          details={
                            [specialization, department, staffId].filter(
                              Boolean,
                            ) as string[]
                          }
                          actionLabel={isRequesting ? "Sending..." : "Request"}
                          loading={isRequesting}
                          onPress={() =>
                            handleRequestSupervision(supervisor.id)
                          }
                        />
                      );
                    })
                  )}
                </>
              )}
            </View>
          ) : (
            <InlineMessage text="No supervisor assigned." />
          )}

          {isSupervisor &&
            projectRequests.map((request) => (
              <View key={request.id} style={styles.supervisionRequest}>
                <View style={styles.requestStatusIcon}>
                  <Ionicons
                    name={
                      request.status === "ACCEPTED"
                        ? "checkmark-circle-outline"
                        : request.status === "REJECTED"
                          ? "close-circle-outline"
                          : "time-outline"
                    }
                    size={19}
                    color={
                      request.status === "ACCEPTED"
                        ? Colors.status.success
                        : request.status === "REJECTED"
                          ? Colors.status.error
                          : Colors.accent
                    }
                  />
                </View>

                <View style={styles.requestStatusContent}>
                  <AppText variant="body2" weight="semibold">
                    Supervision request
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    {request.status === "PENDING"
                      ? "This student is waiting for your response."
                      : `Request ${request.status.toLowerCase()}.`}
                  </AppText>
                </View>

                {request.status === "PENDING" && (
                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      disabled={respondToSupervision.isPending}
                      style={styles.acceptSmallButton}
                      onPress={() =>
                        handleSupervisionResponse(request.id, "ACCEPTED")
                      }
                    >
                      <Ionicons
                        name="checkmark-outline"
                        size={17}
                        color={Colors.text.inverse}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      disabled={respondToSupervision.isPending}
                      style={styles.rejectSmallButton}
                      onPress={() =>
                        handleSupervisionResponse(request.id, "REJECTED")
                      }
                    >
                      <Ionicons
                        name="close-outline"
                        size={17}
                        color={Colors.status.error}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
        </Card>

        {isStudent && canEdit && (
          <View style={styles.primaryActions}>
            {isEditing ? (
              <TouchableOpacity
                disabled={actions.update.isPending}
                style={styles.primaryActionButton}
                onPress={saveChanges}
              >
                {actions.update.isPending ? (
                  <ActivityIndicator size="small" color={Colors.text.inverse} />
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    size={19}
                    color={Colors.text.inverse}
                  />
                )}

                <AppText variant="body2" color="inverse" weight="semibold">
                  {actions.update.isPending ? "Saving..." : "Save changes"}
                </AppText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={isDeleting}
                style={styles.secondaryActionButton}
                onPress={beginEditing}
              >
                <Ionicons
                  name="create-outline"
                  size={19}
                  color={Colors.primary}
                />

                <AppText variant="body2" weight="semibold">
                  Edit project
                </AppText>
              </TouchableOpacity>
            )}

            {!isEditing && (
              <TouchableOpacity
                disabled={isDeleting}
                style={styles.deleteActionButton}
                onPress={confirmDelete}
              >
                {actions.remove.isPending ? (
                  <ActivityIndicator size="small" color={Colors.status.error} />
                ) : (
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color={Colors.status.error}
                  />
                )}

                <AppText variant="body2" color="error" weight="semibold">
                  {actions.remove.isPending ? "Deleting..." : "Delete"}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        )}

        <SectionHeader
          icon="chatbubble-ellipses-outline"
          title="Discussion"
          description="Keep project communication in one place."
        />

        <Card style={styles.card}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Write a message for your project team..."
            placeholderTextColor={Colors.text.tertiary}
            multiline
            style={styles.commentInput}
            textAlignVertical="top"
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
              <>
                <Ionicons
                  name="send-outline"
                  size={16}
                  color={Colors.text.inverse}
                />

                <AppText variant="caption" color="inverse" weight="semibold">
                  Post message
                </AppText>
              </>
            )}
          </TouchableOpacity>

          {reviews.map((review) => (
            <View key={review.id} style={styles.review}>
              <View style={styles.reviewAvatar}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.reviewContent}>
                <AppText variant="caption" weight="semibold">
                  {review.reviewer?.fullName ??
                    review.reviewer?.name ??
                    review.action}
                </AppText>

                <AppText variant="caption" color="secondary">
                  {review.action}
                </AppText>

                <AppText variant="body2" style={styles.reviewBody}>
                  {review.comment || "Review recorded."}
                </AppText>
              </View>
            </View>
          ))}

          {project.comments?.map((item) => (
            <View key={item.id} style={styles.review}>
              <View style={styles.reviewAvatar}>
                <Ionicons
                  name="person-outline"
                  size={15}
                  color={Colors.primary}
                />
              </View>

              <View style={styles.reviewContent}>
                <AppText variant="caption" weight="semibold">
                  {item.author?.fullName ?? "Project participant"}
                </AppText>

                <AppText variant="body2" style={styles.reviewBody}>
                  {item.body}
                </AppText>
              </View>
            </View>
          ))}

          {reviews.length === 0 &&
            (!project.comments || project.comments.length === 0) && (
              <View style={styles.discussionEmpty}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color={Colors.text.tertiary}
                />

                <AppText variant="caption" color="secondary">
                  No discussion yet. Start the conversation above.
                </AppText>
              </View>
            )}
        </Card>

        <SectionHeader
          icon="folder-open-outline"
          title="Project documents"
          description="Files and documents attached to this project."
        />

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
            <View style={styles.inlineEmpty}>
              <Ionicons
                name="document-outline"
                size={22}
                color={Colors.text.tertiary}
              />

              <AppText variant="caption" color="secondary">
                No documents have been added yet.
              </AppText>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const SectionHeader = ({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderIcon}>
      <Ionicons name={icon} size={17} color={Colors.primary} />
    </View>

    <View style={styles.sectionHeaderText}>
      <AppText variant="h5" weight="semibold">
        {title}
      </AppText>

      <AppText variant="caption" color="secondary">
        {description}
      </AppText>
    </View>
  </View>
);

const InfoRow = ({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  last?: boolean;
}) => (
  <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
    <View style={styles.infoIcon}>
      <Ionicons name={icon} size={17} color={Colors.accent} />
    </View>

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

const LoadingRow = ({ label }: { label: string }) => (
  <View style={styles.loadingRow}>
    <ActivityIndicator size="small" color={Colors.primary} />

    <AppText variant="caption" color="secondary">
      {label}
    </AppText>
  </View>
);

const InlineMessage = ({ text }: { text: string }) => (
  <View style={styles.inlineMessage}>
    <AppText variant="caption" color="secondary">
      {text}
    </AppText>
  </View>
);

const DirectoryPerson = ({
  icon,
  name,
  details,
  actionLabel,
  loading,
  accent = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  details: string[];
  actionLabel: string;
  loading: boolean;
  accent?: boolean;
  onPress: () => void;
}) => (
  <View style={styles.directoryCard}>
    <View style={styles.directoryPerson}>
      <View
        style={[styles.directoryAvatar, accent && styles.directoryAvatarAccent]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={accent ? Colors.accent : Colors.primary}
        />
      </View>

      <View style={styles.personDetails}>
        <AppText variant="body2" weight="medium">
          {name}
        </AppText>

        {details.map((detail, index) => (
          <AppText
            key={`${detail}-${index}`}
            variant="caption"
            color="secondary"
          >
            {detail}
          </AppText>
        ))}
      </View>
    </View>

    <TouchableOpacity
      disabled={loading}
      style={[
        styles.directoryActionButton,
        accent && styles.directoryActionButtonAccent,
        loading && styles.directoryActionButtonDisabled,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.text.inverse} />
      ) : (
        <Ionicons
          name={accent ? "send-outline" : "person-add-outline"}
          size={15}
          color={Colors.text.inverse}
        />
      )}

      <AppText variant="caption" color="inverse" weight="semibold">
        {actionLabel}
      </AppText>
    </TouchableOpacity>
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
    <View style={styles.documentIcon}>
      <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
    </View>

    <View style={styles.documentContent}>
      <AppText variant="body2" weight="medium" numberOfLines={2}>
        {title}
      </AppText>

      <AppText variant="caption" color="secondary">
        {type}
      </AppText>
    </View>

    <Ionicons
      name="chevron-forward-outline"
      size={19}
      color={Colors.text.tertiary}
    />
  </TouchableOpacity>
);
