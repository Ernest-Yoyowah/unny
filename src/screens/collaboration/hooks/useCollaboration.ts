import { CollaborationService } from "@/api/services/collaboration.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const COLLABORATION_KEY = ["collaboration"];

export const useAcceptCollaborationInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      CollaborationService.respond(projectId, "ACCEPTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useRejectCollaborationInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId }: { projectId: string }) =>
      CollaborationService.respond(projectId, "DECLINED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
