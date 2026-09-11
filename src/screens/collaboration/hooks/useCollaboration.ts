import { CollaborationService } from "@/api/services/collaboration.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COLLABORATION_KEY = ["collaboration"];
export const COLLABORATION_INVITES_KEY = ["collaborationInvites"];

export const useMyCollaborationInvites = () =>
  useQuery({
    queryKey: COLLABORATION_INVITES_KEY,
    queryFn: CollaborationService.listMine,
  });

export const useAcceptCollaborationInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inviteId }: { inviteId: string }) =>
      CollaborationService.respond(inviteId, "ACCEPTED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: COLLABORATION_INVITES_KEY });
    },
  });
};

export const useRejectCollaborationInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inviteId }: { inviteId: string }) =>
      CollaborationService.respond(inviteId, "DECLINED"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: COLLABORATION_INVITES_KEY });
    },
  });
};
