import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export type CollaborationInviteStatus = "ACCEPTED" | "DECLINED";

export interface CollaborationInviteResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export const CollaborationService = {
  respond: async (
    projectId: string,
    status: CollaborationInviteStatus,
  ): Promise<CollaborationInviteResponse> => {
    const { data } = await apiClient.patch<CollaborationInviteResponse>(
      Endpoints.collaborationInvites.respond(projectId),
      { status },
    );

    return data;
  },
};
