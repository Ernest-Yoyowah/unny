export type DocumentCategory =
  | "lecture_note"
  | "assignment"
  | "past_question"
  | "textbook"
  | "supplementary"
  | "announcement";

export type DocumentStatus = "uploading" | "processing" | "available" | "error";

export interface Document {
  id: string;
  courseId: string;
  uploadedById: string;
  uploadedByName: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadUrl: string;
  status: DocumentStatus;
  downloadCount: number;
  week?: number;
  topic?: string;
  uploadedAt: string;
}

export interface DocumentUploadPayload {
  courseId: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileUri: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  week?: number;
  topic?: string;
}

export interface DocumentGroupedByCategory {
  category: DocumentCategory;
  label: string;
  items: Document[];
}

export interface DocumentGroupedByWeek {
  week: number;
  topic?: string;
  items: Document[];
}
