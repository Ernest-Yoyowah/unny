import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../api/services/project.service";
import { PROJECTS_KEY } from "./useProject";

export const MODERATION_QUEUE_KEY = ["moderation", "queue"];

export const useModerationQueue = () =>
  useQuery({
    queryKey: MODERATION_QUEUE_KEY,
    queryFn: ProjectService.reviewQueue,
  });

export const useModerateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      comment,
    }: {
      id: string;
      action: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";
      comment?: string;
    }) => ProjectService.moderate(id, action, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODERATION_QUEUE_KEY });
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
    },
  });
};
