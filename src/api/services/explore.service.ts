import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export interface ProjectUserProfile {
  id?: string;
  userId?: string;
  fullName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  department?: string | null;
  faculty?: string | null;
  phone?: string | null;
  matricNumber?: string | null;
  level?: string | null;
  staffId?: string | null;
  specialization?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectUser {
  id: string;
  email?: string;
  role?: string;
  fullName?: string;
  name?: string;
  department?: string;
  departmentId?: string;
  avatarUrl?: string | null;
  specialization?: string;
  level?: string;
  profile?: ProjectUserProfile;
}

export interface ExploreProject {
  id: string;
  title?: string;
  department?: string | null;
  academicYear?: string | number | null;
  status?: string | null;

  submittedBy?: {
    id?: string;
    fullName?: string;
    name?: string;
  };

  supervisor?: {
    id?: string;
    fullName?: string;
    name?: string;
  };
}

export interface ExploreResult {
  projects: ExploreProject[];
  users: ProjectUser[];
}

interface ExploreResponse {
  success?: boolean;
  message?: string;

  data?: {
    users?: {
      items?: ProjectUser[];

      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };

    projects?: {
      items?: ExploreProject[];

      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    };
  };
}

const normalizeUser = (user: ProjectUser): ProjectUser => {
  const profile = user.profile;

  return {
    ...user,

    fullName:
      user.fullName ??
      user.name ??
      profile?.fullName ??
      user.email ??
      "Unnamed user",

    name:
      user.name ??
      profile?.fullName ??
      user.fullName ??
      user.email ??
      "Unnamed user",

    department: user.department ?? profile?.department ?? undefined,

    avatarUrl: user.avatarUrl ?? profile?.avatarUrl ?? undefined,

    specialization: user.specialization ?? profile?.specialization ?? undefined,

    level: user.level ?? profile?.level ?? undefined,

    profile,
  };
};

export const ExploreService = {
  search: async (query = ""): Promise<ExploreResult> => {
    const response = await apiClient.get<ExploreResponse>(
      Endpoints.explore.users,
      {
        params: {
          ...(query.trim()
            ? {
                q: query.trim(),
              }
            : {}),
        },
      },
    );

    const users = response.data?.data?.users?.items ?? [];
    const projects = response.data?.data?.projects?.items ?? [];

    return {
      users: Array.isArray(users) ? users.map(normalizeUser) : [],

      projects: Array.isArray(projects) ? projects : [],
    };
  },

  searchUsers: async (
    role?: "STUDENT" | "SUPERVISOR" | "LECTURER",
    query = "",
    department?: string,
  ): Promise<ProjectUser[]> => {
    const response = await apiClient.get<ExploreResponse>(
      Endpoints.explore.users,
      {
        params: {
          scope: "users",

          ...(role ? { role } : {}),

          ...(query.trim()
            ? {
                q: query.trim(),
              }
            : {}),

          ...(department
            ? {
                department,
              }
            : {}),
        },
      },
    );

    const users = response.data?.data?.users?.items;

    if (!Array.isArray(users)) {
      return [];
    }

    return users.map(normalizeUser);
  },

  getStudents: async (query = "") => {
    return ExploreService.searchUsers("STUDENT", query);
  },

  getSupervisors: async (query = "", department?: string) => {
    return ExploreService.searchUsers("SUPERVISOR", query, department);
  },
};
