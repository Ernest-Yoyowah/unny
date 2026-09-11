import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ProjectWorkflowService,
  ProjectUser,
} from "../api/services/project-workflow.service";

export const useProjectReviews = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: ["project-reviews", projectId],
    queryFn: () => ProjectWorkflowService.getReviews(projectId),
    enabled: Boolean(projectId) && enabled,
    staleTime: 30000,
  });
};

export const useProjectCollaborators = (projectId: string, enabled = true) => {
  return useQuery({
    queryKey: ["project-collaborators", projectId],
    queryFn: () => ProjectWorkflowService.getCollaborators(projectId),
    enabled: Boolean(projectId) && enabled,
  });
};

export const useSupervisionRequests = () => {
  return useQuery({
    queryKey: ["supervision-requests"],
    queryFn: () => ProjectWorkflowService.getSupervisionRequests(),
    staleTime: 30000,
  });
};

export const useProjectDirectory = (
  department?: string,
  options?: {
    students?: boolean;
    supervisors?: boolean;
  },
) => {
  const studentsEnabled = options?.students === true;
  const supervisorsEnabled = options?.supervisors === true;

  const studentsQuery = useQuery({
    queryKey: ["project-directory", "students"],
    queryFn: () => ProjectWorkflowService.getStudents(),
    enabled: studentsEnabled,
  });

  const supervisorsQuery = useQuery({
    queryKey: ["project-directory", "supervisors"],
    queryFn: () => ProjectWorkflowService.getSupervisors(),
    enabled: supervisorsEnabled,
  });

  const filterDepartment = (users: ProjectUser[]): ProjectUser[] => {
    if (!department) {
      return users;
    }

    const normalizedDepartment = department.trim().toLowerCase();

    const filtered = users.filter((user) => {
      const userDepartment = user.department ?? user.profile?.department;

      if (!userDepartment) {
        return true;
      }

      return userDepartment.trim().toLowerCase() === normalizedDepartment;
    });

    return filtered.length > 0 ? filtered : users;
  };

  return {
    students: filterDepartment(studentsQuery.data ?? []),
    supervisors: filterDepartment(supervisorsQuery.data ?? []),
    isLoading: studentsQuery.isLoading || supervisorsQuery.isLoading,
    isError: studentsQuery.isError || supervisorsQuery.isError,
    studentsError: studentsQuery.error,
    supervisorsError: supervisorsQuery.error,
  };
};

export const useProjectActions = (projectId: string) => {
  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: (
      payload: Parameters<typeof ProjectWorkflowService.update>[1],
    ) => ProjectWorkflowService.update(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const remove = useMutation({
    mutationFn: () => ProjectWorkflowService.remove(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
    },
  });

  const bookmark = useMutation({
    mutationFn: () => ProjectWorkflowService.toggleBookmark(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });

  const comment = useMutation({
    mutationFn: (body: string) =>
      ProjectWorkflowService.addComment(projectId, body),
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["projects", "detail", projectId],
        (current: any) => {
          if (!current) {
            return current;
          }

          const existingComments = Array.isArray(current.comments)
            ? current.comments
            : [];
          const nextComments = existingComments.some(
            (item: any) => item.id === newComment?.id,
          )
            ? existingComments
            : [...existingComments, newComment];

          return { ...current, comments: nextComments };
        },
      );

      queryClient.setQueryData(["project", projectId], (current: any) => {
        if (!current) {
          return current;
        }

        const existingComments = Array.isArray(current.comments)
          ? current.comments
          : [];
        const nextComments = existingComments.some(
          (item: any) => item.id === newComment?.id,
        )
          ? existingComments
          : [...existingComments, newComment];

        return { ...current, comments: nextComments };
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", "detail", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["project-reviews", projectId],
      });
    },
  });

  return {
    update,
    remove,
    bookmark,
    comment,
  };
};

export const useProjectCollaboratorActions = (projectId: string) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["project-collaborators", projectId],
    });

    queryClient.invalidateQueries({
      queryKey: ["supervision-requests"],
    });

    queryClient.invalidateQueries({
      queryKey: ["project", projectId],
    });

    queryClient.invalidateQueries({
      queryKey: ["projects", "detail", projectId],
    });
  };

  const invite = useMutation({
    mutationFn: (userId: string) =>
      ProjectWorkflowService.inviteCollaborator(projectId, userId),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (userId: string) =>
      ProjectWorkflowService.removeCollaborator(projectId, userId),
    onSuccess: invalidate,
  });

  const respond = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "REJECTED";
    }) => ProjectWorkflowService.respondToCollaborationInvite(id, status),
    onSuccess: invalidate,
  });

  const supervise = useMutation({
    mutationFn: ({
      supervisorId,
      message,
    }: {
      supervisorId: string;
      message: string;
    }) =>
      ProjectWorkflowService.requestSupervision(
        projectId,
        supervisorId,
        message,
      ),
    onSuccess: invalidate,
  });

  return {
    invite,
    remove,
    respond,
    supervise,
  };
};

export const useRespondToSupervision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "REJECTED";
    }) => ProjectWorkflowService.respondToSupervision(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["supervision-requests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project"],
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", "detail", variables.id],
      });
    },
  });
};
