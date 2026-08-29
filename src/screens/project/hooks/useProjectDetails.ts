import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../navigation/types";
import { useProject } from "../../../hooks/useProject";
import {
  useProjectActions,
  useProjectCollaboratorActions,
  useProjectCollaborators,
  useProjectDirectory,
  useProjectReviews,
  useRespondToSupervision,
  useSupervisionRequests,
} from "../../../hooks/useProjectWorkflow";
import { useAuthStore } from "../../../store/auth.store";

type Navigation = NativeStackNavigationProp<MainStackParamList>;

export const useProjectDetails = (
  projectId: string,
  navigation: Navigation,
) => {
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
  const {
    data: supervisionRequests = [],
    refetch: refetchSupervisionRequests,
  } = useSupervisionRequests();
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
      supervisionRequests.filter(
        (request) => String(request.projectId) === String(projectId),
      ),
    [projectId, supervisionRequests],
  );

  const myRequests = useMemo(
    () =>
      projectRequests.filter(
        (request) =>
          !request.requester?.id ||
          String(request.requester.id) === String(currentUser?.id),
      ),
    [currentUser?.id, projectRequests],
  );

  const myPendingRequest = useMemo(
    () => myRequests.find((request) => request.status === "PENDING"),
    [myRequests],
  );

  const myLatestRequest = useMemo(() => {
    if (myRequests.length === 0) {
      return undefined;
    }

    return [...myRequests].sort((a, b) => {
      const firstDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;

      const secondDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return secondDate - firstDate;
    })[0];
  }, [myRequests]);

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
      await refetch();
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

      await refetchSupervisionRequests();

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

    respondToSupervision.mutate(
      {
        id,
        status,
      },
      {
        onSuccess: () => {
          refetchSupervisionRequests();
        },
      },
    );
  };

  const openSupervisionRequests = () => {
    if (isDeleting) {
      return;
    }

    navigation.navigate("SupervisionRequests");
  };

  return {
    project,
    isLoading,
    isError,
    refetch,
    currentUser,
    actions,
    reviews,
    collaborators,
    supervisionRequests,
    respondToSupervision,
    directory,
    collaboratorActions,
    isStudent,
    isSupervisor,
    canEdit,
    canDelete,
    projectRequests,
    myRequests,
    myPendingRequest,
    myLatestRequest,
    availableStudents,
    availableSupervisors,
    isDeleting,
    setIsDeleting,
    isEditing,
    title,
    setTitle,
    abstract,
    setAbstract,
    comment,
    setComment,
    beginEditing,
    cancelEditing,
    saveChanges,
    addComment,
    confirmDelete,
    handleDelete,
    handleInvite,
    handleRemoveCollaborator,
    handleAcceptInvite,
    handleRequestSupervision,
    handleSupervisionResponse,
    openSupervisionRequests,
  };
};
