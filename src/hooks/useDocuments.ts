import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentsService } from "../api/services/documents.service";
import { DocumentUploadPayload } from "../types/document.types";

export const DOCUMENTS_KEY = "documents";

export const useDocuments = (courseId: string) =>
  useQuery({
    queryKey: [DOCUMENTS_KEY, courseId],
    queryFn: () => DocumentsService.getDocuments(courseId),
    enabled: !!courseId,
  });

export const useDocument = (id: string) =>
  useQuery({
    queryKey: [DOCUMENTS_KEY, "detail", id],
    queryFn: () => DocumentsService.getDocument(id),
    enabled: !!id,
  });

export const useUploadDocument = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DocumentUploadPayload) =>
      DocumentsService.uploadDocument(courseId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY, courseId] }),
  });
};

export const useDeleteDocument = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DocumentsService.deleteDocument(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY, courseId] }),
  });
};

export const useDocumentDownloadUrl = (id: string) =>
  useQuery({
    queryKey: [DOCUMENTS_KEY, "download", id],
    queryFn: () => DocumentsService.getDownloadUrl(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
