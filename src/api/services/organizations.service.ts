import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import {
  Organization,
  CreateOrganizationPayload,
  VerificationSubmission,
} from "../../types/organization.types";
import { PaginatedResponse } from "./courses.service";

export const OrganizationsService = {
  getOrganizations: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Organization>> => {
    const { data } = await apiClient.get<PaginatedResponse<Organization>>(
      Endpoints.organizations.list,
      { params },
    );
    return data;
  },

  getOrganization: async (id: string): Promise<Organization> => {
    const { data } = await apiClient.get<Organization>(
      Endpoints.organizations.detail(id),
    );
    return data;
  },

  createOrganization: async (
    payload: CreateOrganizationPayload,
  ): Promise<Organization> => {
    const { data } = await apiClient.post<Organization>(
      Endpoints.organizations.create,
      payload,
    );
    return data;
  },

  submitVerification: async (
    submission: VerificationSubmission,
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("contactName", submission.contactName);
    formData.append("contactTitle", submission.contactTitle);
    if (submission.additionalNotes) {
      formData.append("additionalNotes", submission.additionalNotes);
    }
    submission.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type);
      formData.append(`documents[${index}][fileName]`, doc.fileName);
      formData.append(`documents[${index}][file]`, {
        uri: doc.fileUri,
        name: doc.fileName,
        type: "application/pdf",
      } as unknown as Blob);
    });

    await apiClient.post(
      Endpoints.organizations.submitVerification(submission.organizationId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  joinOrganization: async (joinCode: string): Promise<void> => {
    await apiClient.post(Endpoints.organizations.join, { joinCode });
  },
};
