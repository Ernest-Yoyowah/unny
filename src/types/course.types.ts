export type CourseStatus = "active" | "archived" | "draft";
export type SemesterType = "first" | "second" | "summer";

export interface CourseSchedule {
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  organizationId: string;
  lecturerId: string;
  lecturerName: string;
  lecturerTitle: string;
  department: string;
  status: CourseStatus;
  academicYear: string;
  semester: SemesterType;
  creditUnits: number;
  enrollmentCount: number;
  resourceCount: number;
  coverColor: string;
  isEnrolled?: boolean;
  isPinned?: boolean;
  lastAccessedAt?: string;
  schedule?: CourseSchedule[];
  createdAt: string;
  archivedAt?: string;
}

export interface CreateCoursePayload {
  code: string;
  title: string;
  description: string;
  department: string;
  academicYear: string;
  semester: SemesterType;
  creditUnits: number;
  schedule?: CourseSchedule[];
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  status: "active" | "dropped" | "completed";
}

export interface CourseStudent {
  id: string;
  fullName: string;
  studentId: string;
  avatarUrl?: string;
  enrolledAt: string;
  lastAccessedAt?: string;
}
