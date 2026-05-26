import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { Document, DocumentUploadPayload } from "../../types/document.types";
import { PaginatedResponse } from "./courses.service";

export const DocumentsService = {
  getDocuments: async (
    courseId: string,
  ): Promise<PaginatedResponse<Document>> => {
    const { data } = await apiClient.get<PaginatedResponse<Document>>(
      Endpoints.documents.list(courseId),
    );
    return data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const { data } = await apiClient.get<Document>(
      Endpoints.documents.detail(id),
    );
    return data;
  },

  uploadDocument: async (
    courseId: string,
    payload: DocumentUploadPayload,
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("category", payload.category);
    formData.append("fileSize", String(payload.fileSize));
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.week != null) formData.append("week", String(payload.week));
    if (payload.topic) formData.append("topic", payload.topic);
    formData.append("file", {
      uri: payload.fileUri,
      name: payload.fileName,
      type: payload.fileType,
    } as unknown as Blob);

    const { data } = await apiClient.post<Document>(
      Endpoints.documents.upload(courseId),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(Endpoints.documents.delete(id));
  },

  getDownloadUrl: async (
    id: string,
  ): Promise<{ url: string; expiresAt: number }> => {
    const { data } = await apiClient.get<{ url: string; expiresAt: number }>(
      Endpoints.documents.download(id),
    );
    return data;
  },
};
