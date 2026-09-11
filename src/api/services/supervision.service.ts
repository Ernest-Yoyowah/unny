import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import { Project, normalizeProject } from "./project.service";

export type ReviewAction = "COMMENTED" | "APPROVED" | "REJECTED";

export interface ProjectReview {
  id: string;
  projectId?: string;
  action: ReviewAction | string;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
  reviewerId?: string;
  reviewer?: {
    id?: string;
    fullName?: string;
    email?: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
}

export interface CreateReviewPayload {
  action: ReviewAction;
  comment?: string;
}

export interface SupervisionRequest {
  id: string;
  projectId?: string;
  supervisorId?: string;
  studentId?: string;
  status?: string;
  message?: string;
  createdAt?: string;
  updatedAt?: string;
  project?: Project;
  student?: {
    id?: string;
    fullName?: string;
    email?: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
  supervisor?: {
    id?: string;
    fullName?: string;
    email?: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
}

const unwrap = <T>(
  data:
    | T
    | { data: T }
    | { project: T }
    | { projects: T }
    | { review: T }
    | { reviews: T }
    | { request: T }
    | { requests: T },
): T => {
  if (typeof data === "object" && data !== null && "data" in data) {
    return unwrap(
      (data as { data: T }).data as
        | T
        | { data: T }
        | { project: T }
        | { projects: T }
        | { review: T }
        | { reviews: T }
        | { request: T }
        | { requests: T },
    );
  }

  if (typeof data === "object" && data !== null && "project" in data) {
    return (data as { project: T }).project;
  }

  if (typeof data === "object" && data !== null && "projects" in data) {
    return (data as { projects: T }).projects;
  }

  if (typeof data === "object" && data !== null && "review" in data) {
    return (data as { review: T }).review;
  }

  if (typeof data === "object" && data !== null && "reviews" in data) {
    return (data as { reviews: T }).reviews;
  }

  if (typeof data === "object" && data !== null && "request" in data) {
    return (data as { request: T }).request;
  }

  if (typeof data === "object" && data !== null && "requests" in data) {
    return (data as { requests: T }).requests;
  }

  return data as T;
};

const normalizeReview = (review: ProjectReview): ProjectReview => {
  const reviewer = review.reviewer;

  return {
    ...review,
    reviewer: reviewer
      ? {
          ...reviewer,
          fullName: reviewer.fullName ?? reviewer.profile?.fullName,
        }
      : undefined,
  };
};

const normalizeRequest = (request: SupervisionRequest): SupervisionRequest => {
  const student = request.student;
  const supervisor = request.supervisor;

  return {
    ...request,
    project: request.project ? normalizeProject(request.project) : undefined,
    student: student
      ? {
          ...student,
          fullName: student.fullName ?? student.profile?.fullName,
        }
      : undefined,
    supervisor: supervisor
      ? {
          ...supervisor,
          fullName: supervisor.fullName ?? supervisor.profile?.fullName,
        }
      : undefined,
  };
};

export const SupervisionService = {
  projects: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<
      Project[] | { data: Project[] } | { projects: Project[] }
    >(Endpoints.supervision.projects);

    return unwrap<Project[]>(data).map(normalizeProject);
  },

  reviewQueue: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<
      Project[] | { data: Project[] } | { projects: Project[] }
    >(Endpoints.supervision.reviewQueue);

    return unwrap<Project[]>(data).map(normalizeProject);
  },

  getReviews: async (projectId: string): Promise<ProjectReview[]> => {
    const { data } = await apiClient.get<
      ProjectReview[] | { data: ProjectReview[] } | { reviews: ProjectReview[] }
    >(Endpoints.supervision.reviews(projectId));

    return unwrap<ProjectReview[]>(data).map(normalizeReview);
  },

  createReview: async (
    projectId: string,
    payload: CreateReviewPayload,
  ): Promise<ProjectReview> => {
    const { data } = await apiClient.post<
      ProjectReview | { data: ProjectReview } | { review: ProjectReview }
    >(Endpoints.supervision.reviews(projectId), payload);

    return normalizeReview(unwrap<ProjectReview>(data));
  },

  comment: async (
    projectId: string,
    comment: string,
  ): Promise<ProjectReview> => {
    return SupervisionService.createReview(projectId, {
      action: "COMMENTED",
      comment,
    });
  },

  approve: async (
    projectId: string,
    comment?: string,
  ): Promise<ProjectReview> => {
    return SupervisionService.createReview(projectId, {
      action: "APPROVED",
      comment,
    });
  },

  reject: async (
    projectId: string,
    comment?: string,
  ): Promise<ProjectReview> => {
    return SupervisionService.createReview(projectId, {
      action: "REJECTED",
      comment,
    });
  },

  getRequest: async (projectId: string): Promise<SupervisionRequest> => {
    const { data } = await apiClient.get<
      | SupervisionRequest
      | { data: SupervisionRequest }
      | { request: SupervisionRequest }
    >(Endpoints.supervision.requests(projectId));

    return normalizeRequest(unwrap<SupervisionRequest>(data));
  },
};
