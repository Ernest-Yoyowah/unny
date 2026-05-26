export type NotificationType =
  | "course_enrolled"
  | "course_archived"
  | "document_uploaded"
  | "assignment_posted"
  | "announcement"
  | "organization_verified"
  | "enrollment_approved";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface NotificationGroup {
  date: string;
  label: string;
  items: Notification[];
}
