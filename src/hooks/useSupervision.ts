import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateReviewPayload,
  SupervisionService,
} from "../api/services/supervision.service";

export const supervisionKeys = {
  all: ["supervision"] as const,
  projects: () => [...supervisionKeys.all, "projects"] as const,
  reviewQueue: () => [...supervisionKeys.all, "review-queue"] as const,
  reviews: (projectId: string) =>
    [...supervisionKeys.all, "reviews", projectId] as const,
  request: (projectId: string) =>
    [...supervisionKeys.all, "request", projectId] as const,
};

export const useSupervisedProjects = () => {
  return useQuery({
    queryKey: supervisionKeys.projects(),
    queryFn: SupervisionService.projects,
  });
};

export const useReviewQueue = () => {
  return useQuery({
    queryKey: supervisionKeys.reviewQueue(),
    queryFn: SupervisionService.reviewQueue,
  });
};

export const useProjectReviews = (projectId?: string) => {
  return useQuery({
    queryKey: supervisionKeys.reviews(projectId ?? ""),
    queryFn: () => SupervisionService.getReviews(projectId as string),
    enabled: Boolean(projectId),
  });
};

export const useSupervisionRequest = (projectId?: string) => {
  return useQuery({
    queryKey: supervisionKeys.request(projectId ?? ""),
    queryFn: () => SupervisionService.getRequest(projectId as string),
    enabled: Boolean(projectId),
  });
};

export const useCreateProjectReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: CreateReviewPayload;
    }) => SupervisionService.createReview(projectId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviewQueue(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.projects(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviews(variables.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ["projects", "mine"],
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useCommentOnProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      comment,
    }: {
      projectId: string;
      comment: string;
    }) => SupervisionService.comment(projectId, comment),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviewQueue(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviews(variables.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useApproveProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      comment,
    }: {
      projectId: string;
      comment?: string;
    }) => SupervisionService.approve(projectId, comment),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviewQueue(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.projects(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviews(variables.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useRejectProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      comment,
    }: {
      projectId: string;
      comment?: string;
    }) => SupervisionService.reject(projectId, comment),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviewQueue(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.projects(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviews(variables.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};

export const useRequestProjectChanges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      comment,
    }: {
      projectId: string;
      comment: string;
    }) => SupervisionService.requestChanges(projectId, comment),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviewQueue(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.projects(),
      });

      queryClient.invalidateQueries({
        queryKey: supervisionKeys.reviews(variables.projectId),
      });

      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};
