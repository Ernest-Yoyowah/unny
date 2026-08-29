import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { Project } from "./project.service";

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
}

export interface ProjectUser {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  department?: string;
  departmentId?: string;
  role?: string;
  avatarUrl?: string | null;
  specialization?: string;
  level?: string;
  profile?: ProjectUserProfile;
}

interface RawUser {
  id: string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  department?: string | null;
  departmentId?: string | null;
  role?: string | null;
  avatarUrl?: string | null;
  specialization?: string | null;
  level?: string | null;
  profile?: ProjectUserProfile | null;
}

export interface Collaboration {
  id: string;
  userId: string;
  role: string;
  status: string;
  user?: ProjectUser;
}

export interface SupervisionRequest {
  id: string;
  projectId: string;
  supervisorId: string;
  status: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  supervisor?: ProjectUser;
  requester?: ProjectUser;
  project?: {
    id: string;
    title: string;
  };
}

export interface ProjectReview {
  id: string;
  action: "COMMENTED" | "APPROVED" | "REJECTED";
  comment?: string;
  createdAt?: string;
  reviewer?: ProjectUser;
}

const normalizeUser = (user: RawUser): ProjectUser => {
  const profile = user.profile ?? undefined;

  return {
    id: user.id,
    fullName: user.fullName ?? profile?.fullName ?? user.name ?? undefined,
    name: user.name ?? profile?.fullName ?? user.fullName ?? undefined,
    email: user.email ?? undefined,
    department: user.department ?? profile?.department ?? undefined,
    departmentId: user.departmentId ?? undefined,
    role: user.role ?? undefined,
    avatarUrl: user.avatarUrl ?? profile?.avatarUrl ?? null,
    specialization: user.specialization ?? profile?.specialization ?? undefined,
    level: user.level ?? profile?.level ?? undefined,
    profile,
  };
};

const unwrap = <T>(value: T | { data: T } | { projects: T }): T => {
  if (typeof value === "object" && value !== null && "data" in value) {
    return (value as { data: T }).data;
  }

  if (typeof value === "object" && value !== null && "projects" in value) {
    return (value as { projects: T }).projects;
  }

  return value as T;
};

const unwrapList = <T>(
  value:
    | T[]
    | { data: T[] }
    | { data: { items: T[] } }
    | { data: { users: T[] | { items: T[] } } }
    | { items: T[] }
    | { results: T[] }
    | { users: T[] }
    | { users: { items: T[] } },
): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if ("items" in value && Array.isArray(value.items)) {
    return value.items;
  }

  if ("results" in value && Array.isArray(value.results)) {
    return value.results;
  }

  if ("users" in value) {
    if (Array.isArray(value.users)) {
      return value.users;
    }

    if (
      typeof value.users === "object" &&
      value.users !== null &&
      "items" in value.users &&
      Array.isArray(value.users.items)
    ) {
      return value.users.items;
    }
  }

  if ("data" in value) {
    if (Array.isArray(value.data)) {
      return value.data;
    }

    if (
      typeof value.data === "object" &&
      value.data !== null &&
      "items" in value.data &&
      Array.isArray(value.data.items)
    ) {
      return value.data.items;
    }

    if (
      typeof value.data === "object" &&
      value.data !== null &&
      "users" in value.data
    ) {
      const users = value.data.users;

      if (Array.isArray(users)) {
        return users;
      }

      if (
        typeof users === "object" &&
        users !== null &&
        "items" in users &&
        Array.isArray(users.items)
      ) {
        return users.items;
      }
    }
  }

  return [];
};

export const ProjectWorkflowService = {
  update: async (
    id: string,
    payload: Partial<
      Pick<
        Project,
        "title" | "abstract" | "academicYear" | "department" | "repoUrl"
      >
    >,
  ) => {
    const { data } = await apiClient.patch(
      Endpoints.projects.update(id),
      payload,
    );

    return unwrap(data);
  },

  remove: async (id: string) => {
    await apiClient.delete(Endpoints.projects.delete(id));
  },

  toggleBookmark: async (id: string) => {
    const { data } = await apiClient.post(Endpoints.projects.bookmark(id));

    return unwrap(data);
  },

  bookmarks: async (): Promise<Project[]> => {
    const { data } = await apiClient.get(Endpoints.projects.bookmarks);

    return unwrap(data);
  },

  addComment: async (id: string, body: string) => {
    const { data } = await apiClient.post(Endpoints.projects.comments(id), {
      body,
    });

    return unwrap(data);
  },

  getReviews: async (id: string): Promise<ProjectReview[]> => {
    const { data } = await apiClient.get(Endpoints.projects.reviews(id));

    const reviews = unwrapList(
      data as
        | ProjectReview[]
        | { data: ProjectReview[] }
        | { data: { items: ProjectReview[] } }
        | { items: ProjectReview[] },
    );

    return reviews.map((item) => {
      const reviewer = item.reviewer as RawUser | undefined;

      return {
        ...item,
        reviewer: reviewer ? normalizeUser(reviewer) : undefined,
      };
    });
  },

  review: async (
    id: string,
    action: ProjectReview["action"],
    comment?: string,
  ) => {
    const { data } = await apiClient.post(Endpoints.projects.reviews(id), {
      action,
      comment,
    });

    return unwrap(data);
  },

  getCollaborators: async (id: string): Promise<Collaboration[]> => {
    const { data } = await apiClient.get(Endpoints.projects.collaborators(id));

    const collaborators = unwrapList(
      data as
        | Collaboration[]
        | { data: Collaboration[] }
        | { data: { items: Collaboration[] } }
        | { items: Collaboration[] },
    );

    return collaborators.map((item) => {
      const user = item.user as RawUser | undefined;

      return {
        ...item,
        user: user ? normalizeUser(user) : undefined,
      };
    });
  },

  inviteCollaborator: async (id: string, userId: string) => {
    const { data } = await apiClient.post(
      Endpoints.projects.collaborators(id),
      {
        userId,
      },
    );

    return unwrap(data);
  },

  respondToCollaborationInvite: async (
    id: string,
    status: "ACCEPTED" | "REJECTED",
  ) => {
    const { data } = await apiClient.patch(
      Endpoints.collaborationInvites.respond(id),
      {
        status,
      },
    );

    return unwrap(data);
  },

  removeCollaborator: async (id: string, userId: string) => {
    await apiClient.delete(`${Endpoints.projects.collaborators(id)}/${userId}`);
  },

  requestSupervision: async (
    id: string,
    supervisorId: string,
    message: string,
  ) => {
    const { data } = await apiClient.post(Endpoints.projects.supervision(id), {
      supervisorId,
      message,
    });

    return unwrap(data);
  },

  getSupervisionRequests: async (): Promise<SupervisionRequest[]> => {
    const { data } = await apiClient.get("/supervision-requests/mine");

    const requests = unwrapList(
      data as
        | SupervisionRequest[]
        | { data: SupervisionRequest[] }
        | { data: { items: SupervisionRequest[] } }
        | { items: SupervisionRequest[] },
    );

    return requests.map((request) => {
      const supervisor = request.supervisor as RawUser | undefined;

      const requester = request.requester as RawUser | undefined;

      return {
        ...request,
        supervisor: supervisor ? normalizeUser(supervisor) : undefined,
        requester: requester ? normalizeUser(requester) : undefined,
      };
    });
  },

  respondToSupervision: async (id: string, status: "ACCEPTED" | "REJECTED") => {
    const { data } = await apiClient.patch(`/supervision-requests/${id}`, {
      status,
    });

    return unwrap(data);
  },

  exploreUsers: async (
    role: "STUDENT" | "SUPERVISOR",
    query = "",
  ): Promise<ProjectUser[]> => {
    const { data } = await apiClient.get(Endpoints.explore.users, {
      params: {
        scope: "users",
        role,
        q: query,
      },
    });

    const users = unwrapList(
      data as
        | RawUser[]
        | { data: RawUser[] }
        | { data: { items: RawUser[] } }
        | { data: { users: RawUser[] | { items: RawUser[] } } }
        | { items: RawUser[] }
        | { results: RawUser[] }
        | { users: RawUser[] }
        | { users: { items: RawUser[] } },
    );

    return users.map(normalizeUser);
  },

  getStudents: async (query = ""): Promise<ProjectUser[]> => {
    return ProjectWorkflowService.exploreUsers("STUDENT", query);
  },

  getSupervisors: async (query = ""): Promise<ProjectUser[]> => {
    return ProjectWorkflowService.exploreUsers("SUPERVISOR", query);
  },
};
