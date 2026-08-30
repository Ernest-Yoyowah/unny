export type NotificationType =
  | "COLLABORATION_INVITE"
  | "COURSE_ENROLLED"
  | "COURSE_ARCHIVED"
  | "DOCUMENT_UPLOADED"
  | "ASSIGNMENT_POSTED"
  | "ANNOUNCEMENT"
  | "ORGANIZATION_VERIFIED"
  | "ENROLLMENT_APPROVED";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedProjectId?: string;
  metadata?: Record<string, string> | null;
  createdAt: string;
}

export interface NotificationGroup {
  date: string;
  label: string;
  items: Notification[];
}
