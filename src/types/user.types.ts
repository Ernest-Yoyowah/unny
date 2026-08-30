export type UserRole = "student" | "lecturer" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  organizationId: string;
  organizationName: string;
  departmentId?: string;
  isVerified: boolean;
  joinedAt: string;
  lastActiveAt: string;
  studentId: string;
  level?: string;
}

export interface StudentProfile extends User {
  role: "student";
  studentId: string;
  level: string;
  department: string;
  enrolledCourseIds: string[];
  pinnedCourseIds: string[];
  gpa?: number;
  totalCreditUnits: number;
}

export interface LecturerProfile extends User {
  role: "lecturer";
  staffId: string;
  title: string;
  department: string;
  specialization: string;
  managedCourseIds: string[];
  totalStudentsCount: number;
}

export interface AdminProfile extends User {
  role: "admin";
  permissions: AdminPermission[];
}

export type AdminPermission =
  | "manage_members"
  | "manage_courses"
  | "manage_organization"
  | "verify_members"
  | "manage_settings";
