import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export type CollaborationInviteStatus = "ACCEPTED" | "DECLINED";

export interface CollaborationInviteProject {
  id: string;
  title: string;
  abstract?: string;
  department?: string;
  academicYear?: number;
  status?: string;
  submittedBy?: {
    id: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string | null;
    };
  };
}

export interface CollaborationInviteItem {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  status: "INVITED" | CollaborationInviteStatus;
  invitedAt: string;
  respondedAt?: string | null;
  project?: CollaborationInviteProject;
}

export interface CollaborationInviteListResponse {
  success: boolean;
  message: string;
  data: CollaborationInviteItem[];
}

export interface CollaborationInviteResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export const CollaborationService = {
  listMine: async (): Promise<CollaborationInviteListResponse> => {
    const { data } = await apiClient.get<CollaborationInviteListResponse>(
      Endpoints.collaborationInvites.mine,
    );

    return data;
  },

  respond: async (
    inviteId: string,
    status: CollaborationInviteStatus,
  ): Promise<CollaborationInviteResponse> => {
    const { data } = await apiClient.patch<CollaborationInviteResponse>(
      Endpoints.collaborationInvites.respond(inviteId),
      { status },
    );

    return data;
  },
};
