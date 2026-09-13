import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AppText,
  Card,
  DirectoryPerson,
  EmptyState,
  ScreenSkeleton,
} from "../../components/ui";
import { Colors } from "../../theme";
import { MainStackParamList } from "../../navigation/types";
import { styles } from "./styles/ProjectDetailsScreen.styles";
import { formatCommentDate } from "@/utils/date.utils";
import { useProjectDetails } from "./hooks/useProjectDetails";
import { SupervisionOverview } from "./components/project-details/SupervisionOverview";
import { CollaboratorList } from "./components/project-details/CollaboratorList";
import { CollaboratorInviteSection } from "./components/project-details/CollaboratorInviteSection";
import { DocumentRow } from "@/components/document/DocumentRow";
import {
  ProjectService,
  getProjectDocumentTitle,
  getProjectStatusPresentation,
  normalizeProjectStatus,
} from "../../api/services/project.service";
import {
  InfoRow,
  InlineMessage,
  LoadingRow,
  SectionHeader,
} from "./components/project-details/ProjectDetailsUI";
import { extractApiError } from "../../api/client";

type Props = NativeStackScreenProps<MainStackParamList, "ProjectDetails">;

export const ProjectDetailsScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { projectId } = route.params;
  const insets = useSafeAreaInsets();
  const {
    project,
    isLoading,
    isError,
    refetch,
    currentUser,
    actions,
    reviews,
    collaborators,
    respondToSupervision,
    directory,
    collaboratorActions,
    isStudent,
    isSupervisor,
    isProjectOwner,
    canEdit,
    projectRequests,
    myRequests,
    myPendingRequest,
    myLatestRequest,
    availableStudents,
    availableSupervisors,
    isDeleting,
    isEditing,
    abstract,
    setAbstract,
    comment,
    setComment,
    beginEditing,
    cancelEditing,
    saveChanges,
    addComment,
    handleSubmitForReview,
    confirmDelete,
    handleInvite,
    handleRemoveCollaborator,
    handleAcceptInvite,
    handleRequestSupervision,
    handleSupervisionResponse,
    openSupervisionRequests,
  } = useProjectDetails(projectId, navigation);
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<{
    uri: string;
    name: string;
    mimeType: string;
    size?: number;
  } | null>(null);

  const currentProjectStatus = normalizeProjectStatus(project?.status);
  const canUploadProjectFile =
    isStudent &&
    canEdit &&
    (currentProjectStatus === "DRAFT" || currentProjectStatus === "REJECTED");

  const statusPresentation = useMemo(
    () => getProjectStatusPresentation(project?.status),
    [project?.status],
  );

  const projectDocuments = useMemo(() => {
    if (!project) {
      return [];
    }

    const docs = [...(project.documents ?? [])];
    const fallbackUrl = project.fileUrl ?? project.fileKey;

    if (fallbackUrl) {
      const alreadyExists = docs.some(
        (doc) =>
          doc.url === fallbackUrl ||
          doc.id === project.id ||
          doc.name === project.fileKey?.split("/").pop() ||
          doc.name === project.fileUrl?.split("/").pop(),
      );

      if (!alreadyExists) {
        docs.unshift({
          id: `${project.id}-file`,
          name: getProjectDocumentTitle(project.fileKey ?? project.fileUrl),
          title: getProjectDocumentTitle(project.fileKey ?? project.fileUrl),
          type: "FILE",
          url: fallbackUrl,
        });
      }
    }

    return docs.filter(
      (doc, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.id === doc.id ||
            candidate.url === doc.url ||
            candidate.name === doc.name,
        ) === index,
    );
  }, [project]);

  const pickReportFile = async () => {
    if (!project || !canUploadProjectFile) {
      Alert.alert(
        "Upload unavailable",
        "This project can only accept a new file while it is in Draft or Rejected status.",
      );
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const file = result.assets[0];
      if (file.size && file.size > 20 * 1024 * 1024) {
        Alert.alert("File is too large", "Choose a PDF smaller than 20 MB.");
        return;
      }

      setSelectedUpload({
        uri: file.uri,
        name: file.name || `project-report-${Date.now()}.pdf`,
        mimeType: file.mimeType || "application/pdf",
        size: file.size,
      });
    } catch (error) {
      Alert.alert(
        "Unable to select PDF",
        error instanceof Error ? error.message : "Please try again.",
      );
    }
  };

  const uploadReport = async () => {
    if (!project || !selectedUpload || !canUploadProjectFile) {
      return;
    }

    try {
      setIsUploadingReport(true);
      await ProjectService.uploadReport(project.id, selectedUpload);
      setSelectedUpload(null);
      await refetch();
      Alert.alert("Report uploaded", "Your project file has been added.");
    } catch (error) {
      Alert.alert(
        "Upload failed",
        error instanceof Error
          ? error.message
          : "We could not upload the report.",
      );
    } finally {
      setIsUploadingReport(false);
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

          <View style={styles.heroActions}>
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => refetch()}
              style={styles.refreshButton}
              accessibilityRole="button"
              accessibilityLabel="Refresh project details"
            >
              <Ionicons
                name={isLoading ? "sync" : "refresh-outline"}
                size={18}
                color={Colors.text.inverse}
              />
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
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusPresentation.badgeBackground },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusPresentation.dotColor },
              ]}
            />

            <AppText style={styles.statusText}>
              {statusPresentation.label}
            </AppText>
          </View>

          <AppText style={styles.heroYear}>
            {project.academicYear ?? "Academic year"}
          </AppText>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + 40,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

          {isStudent && (
            <SupervisionOverview
              myRequests={myRequests}
              myLatestRequest={myLatestRequest}
              onViewRequests={openSupervisionRequests}
            />
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

              <TouchableOpacity
                style={styles.attentionAction}
                onPress={openSupervisionRequests}
                accessibilityRole="button"
                accessibilityLabel="View supervision requests"
              >
                <AppText variant="caption" color="inverse" weight="semibold">
                  Requests
                </AppText>
              </TouchableOpacity>
            </Card>
          )}

          {isStudent &&
            isProjectOwner &&
            !project.supervisor &&
            !myLatestRequest && (
              <Card style={styles.nextStepCard}>
                <View style={styles.nextStepIcon}>
                  <Ionicons
                    name="school-outline"
                    size={22}
                    color={Colors.accent}
                  />
                </View>

                <View style={styles.nextStepContent}>
                  <AppText variant="body2" weight="semibold">
                    Find a supervisor
                  </AppText>

                  <AppText variant="caption" color="secondary">
                    Your project does not have a supervisor yet. Browse
                    available supervisors below to send a request.
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
              <AppText
                variant="body2"
                color="secondary"
                style={styles.bodyText}
              >
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

            <CollaboratorList
              collaborators={collaborators}
              currentUserId={currentUser?.id}
              isStudent={isStudent}
              isResponding={collaboratorActions.respond.isPending}
              isRemoving={collaboratorActions.remove.isPending}
              onAcceptInvite={handleAcceptInvite}
              onRemoveCollaborator={handleRemoveCollaborator}
            />

            {isStudent && isProjectOwner && (
              <CollaboratorInviteSection
                students={availableStudents}
                isLoading={directory.isLoading}
                isError={directory.isError}
                isInviting={(studentId) =>
                  collaboratorActions.invite.isPending &&
                  collaboratorActions.invite.variables === studentId
                }
                onInvite={handleInvite}
              />
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
            ) : isStudent && isProjectOwner ? (
              <View style={styles.workflowBlock}>
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
                    ) : directory.isError &&
                      availableSupervisors.length === 0 ? (
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
                          supervisor.department ??
                          supervisor.profile?.department;

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
                            actionLabel={
                              isRequesting ? "Sending..." : "Request"
                            }
                            loading={isRequesting}
                            accent
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
              <InlineMessage
                text={
                  isStudent && !isProjectOwner
                    ? "Only the project owner can manage supervisor requests."
                    : "No supervisor assigned."
                }
              />
            )}

            {isSupervisor &&
              projectRequests.map((request) => (
                <View key={request.id} style={styles.supervisionRequest}>
                  <View
                    style={[
                      styles.requestStatusIcon,
                      request.status === "ACCEPTED" &&
                        styles.requestStatusIconAccepted,
                      request.status === "REJECTED" &&
                        styles.requestStatusIconRejected,
                    ]}
                  >
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
                      {request.requester?.fullName
                        ? `${request.requester.fullName} · `
                        : ""}
                      {request.status === "PENDING"
                        ? "Waiting for your response."
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
                    <ActivityIndicator
                      size="small"
                      color={Colors.text.inverse}
                    />
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
                <>
                  <TouchableOpacity
                    disabled={
                      isDeleting ||
                      project.status === "PENDING REVIEW" ||
                      !project.supervisor
                    }
                    style={[
                      styles.primaryActionButton,
                      (!project.supervisor ||
                        project.status === "PENDING REVIEW") &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleSubmitForReview}
                  >
                    {project.status === "PENDING REVIEW" ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.text.inverse}
                      />
                    ) : (
                      <Ionicons
                        name="send-outline"
                        size={19}
                        color={Colors.text.inverse}
                      />
                    )}

                    <AppText variant="body2" color="inverse" weight="semibold">
                      {project.status === "PENDING REVIEW"
                        ? "Awaiting review"
                        : !project.supervisor
                          ? "Awaiting supervisor"
                          : "Submit for review"}
                    </AppText>
                  </TouchableOpacity>

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
                </>
              )}

              {!isEditing && (
                <TouchableOpacity
                  disabled={isDeleting}
                  style={styles.deleteActionButton}
                  onPress={confirmDelete}
                >
                  {actions.remove.isPending ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.status.error}
                    />
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

          {isStudent && (
            <>
              <SectionHeader
                icon="checkmark-done-outline"
                title="Review feedback"
                description="Supervisor comments and decisions for this project."
              />

              <Card style={styles.card}>
                {reviews.length > 0 ? (
                  reviews.map((review) => (
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
                            "Supervisor"}
                        </AppText>

                        <AppText variant="caption" color="secondary">
                          {review.action === "APPROVED"
                            ? "Approved"
                            : review.action === "REJECTED"
                              ? "Rejected"
                              : review.action === "CHANGES_REQUESTED"
                                ? "Changes requested"
                                : "Commented"}
                        </AppText>

                        <AppText variant="body2" style={styles.reviewBody}>
                          {review.comment || "Review recorded."}
                        </AppText>
                      </View>
                    </View>
                  ))
                ) : project.status === "PENDING REVIEW" ? (
                  <View style={styles.discussionEmpty}>
                    <Ionicons
                      name="time-outline"
                      size={22}
                      color={Colors.text.tertiary}
                    />

                    <AppText variant="caption" color="secondary">
                      Your project is currently waiting for review.
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.discussionEmpty}>
                    <Ionicons
                      name="clipboard-outline"
                      size={22}
                      color={Colors.text.tertiary}
                    />

                    <AppText variant="caption" color="secondary">
                      No review feedback yet. Submit your project when you are
                      ready.
                    </AppText>
                  </View>
                )}
              </Card>
            </>
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
                  <View style={styles.commentMeta}>
                    <AppText variant="caption" weight="semibold">
                      {item.author?.fullName ?? "Project participant"}
                    </AppText>

                    {item.createdAt && (
                      <AppText variant="caption" color="secondary">
                        {formatCommentDate(item.createdAt)}
                      </AppText>
                    )}
                  </View>

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
            {isStudent && canEdit && (
              <View style={{ marginBottom: 16 }}>
                {selectedUpload ? (
                  <View style={styles.selectedUploadRow}>
                    <View style={styles.selectedUploadInfo}>
                      <Ionicons
                        name="document-outline"
                        size={18}
                        color={Colors.primary}
                      />

                      <View style={styles.selectedUploadTextBlock}>
                        <AppText variant="body2" weight="semibold">
                          {selectedUpload.name}
                        </AppText>
                        <AppText variant="caption" color="secondary">
                          Ready to upload
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.selectedUploadActions}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={uploadReport}
                        disabled={isUploadingReport}
                        style={[
                          styles.confirmUploadButton,
                          isUploadingReport && styles.buttonDisabled,
                        ]}
                      >
                        {isUploadingReport ? (
                          <ActivityIndicator
                            size="small"
                            color={Colors.text.inverse}
                          />
                        ) : (
                          <Ionicons
                            name="cloud-upload-outline"
                            size={16}
                            color={Colors.text.inverse}
                          />
                        )}

                        <AppText
                          variant="caption"
                          color="inverse"
                          weight="semibold"
                        >
                          {isUploadingReport ? "Uploading..." : "Upload"}
                        </AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setSelectedUpload(null)}
                        style={styles.cancelUploadButton}
                      >
                        <AppText
                          variant="caption"
                          color="secondary"
                          weight="semibold"
                        >
                          Remove
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={pickReportFile}
                    disabled={isUploadingReport}
                    style={[
                      styles.primaryActionButton,
                      isUploadingReport && styles.buttonDisabled,
                    ]}
                  >
                    {isUploadingReport ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.text.inverse}
                      />
                    ) : (
                      <Ionicons
                        name="cloud-upload-outline"
                        size={19}
                        color={Colors.text.inverse}
                      />
                    )}

                    <AppText variant="body2" color="inverse" weight="semibold">
                      {isUploadingReport ? "Uploading..." : "Add project file"}
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {projectDocuments.length ? (
              projectDocuments.map((document) => (
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
      </KeyboardAvoidingView>
    </View>
  );
};
