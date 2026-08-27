import * as FileSystem from "expo-file-system/legacy";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export type ProjectStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | string;

export interface Project {
  id: string;
  title: string;
  abstract?: string;
  department?: string;
  academicYear?: number;
  yearGroup?: string;
  progress?: number;
  status: ProjectStatus;
  repoUrl?: string;
  fileUrl?: string;
  fileKey?: string;
  demoUrl?: string;
  certificateKey?: string;
  submittedById?: string;
  supervisorId?: string;
  submittedAt?: string;
  reviewedAt?: string;
  collaborators?: Array<{
    id: string;
    userId: string;
    role: string;
    status: string;
    user?: { id?: string; profile?: { fullName?: string; avatarUrl?: string } };
  }>;
  submittedBy?: { id?: string; fullName?: string; email?: string };
  supervisor?: { id?: string; fullName?: string; name?: string };
  comments?: Array<{
    id: string;
    body: string;
    createdAt?: string;
    author?: { fullName?: string };
  }>;
  tags?: Array<{ id: string; name: string }>;
  documents?: Array<{
    id: string;
    name?: string;
    title?: string;
    type?: string;
    url?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export const normalizeProject = (project: Project): Project => {
  const submittedBy = project.submittedBy as
    | (Project["submittedBy"] & {
        profile?: { fullName?: string; avatarUrl?: string };
      })
    | undefined;
  const supervisor = project.supervisor as
    | (Project["supervisor"] & {
        profile?: { fullName?: string; avatarUrl?: string };
      })
    | undefined;
  const comments = project.comments?.map((comment) => {
    const author = comment.author as
      | (typeof comment.author & { profile?: { fullName?: string } })
      | undefined;
    return {
      ...comment,
      author: author
        ? { ...author, fullName: author.fullName ?? author.profile?.fullName }
        : undefined,
    };
  });
  return {
    ...project,
    submittedBy: submittedBy
      ? {
          ...submittedBy,
          fullName: submittedBy.fullName ?? submittedBy.profile?.fullName,
        }
      : undefined,
    supervisor: supervisor
      ? {
          ...supervisor,
          fullName: supervisor.fullName ?? supervisor.profile?.fullName,
        }
      : undefined,
    comments,
  };
};

export interface ProjectPage {
  projects: Project[];
  pageInfo?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNextPage?: boolean;
  };
}

export interface ProjectQuery {
  q?: string;
  department?: string;
  academicYear?: string;
  page?: number;
  limit?: number;
}

export interface CreateProjectPayload {
  title: string;
  abstract: string;
  academicYear: number;
  department: string;
  repoUrl?: string;
  demoUrl?: string;
  supervisorId?: string;
  tagIds?: string[];
  fileUrl?: string;
  fileKey?: string;
}

interface PresignedUpload {
  uploadUrl?: string;
  fileUrl?: string;
  key?: string;
}

const normalizeUpload = (
  data: PresignedUpload | { data: PresignedUpload },
): PresignedUpload => ("data" in data ? data.data : data);

const unwrap = <T>(
  data: T | { data: T } | { project: T } | { projects: T },
): T => {
  if (typeof data === "object" && data !== null && "data" in data) {
    return unwrap(
      (data as { data: T }).data as
        | T
        | { data: T }
        | { project: T }
        | { projects: T },
    );
  }
  if (typeof data === "object" && data !== null && "project" in data) {
    return (data as { project: T }).project;
  }
  if (typeof data === "object" && data !== null && "projects" in data) {
    return (data as { projects: T }).projects;
  }
  return data as T;
};

export const ProjectService = {
  explore: async (params?: ProjectQuery): Promise<ProjectPage> => {
    const { data } = await apiClient.get<
      ProjectPage | { data: ProjectPage } | { data: Project[] } | Project[]
    >(Endpoints.projects.explore, { params });
    const normalized = unwrap<ProjectPage | Project[]>(data);
    if (Array.isArray(normalized)) {
      return { projects: normalized.map(normalizeProject) };
    }
    return {
      ...normalized,
      projects: normalized.projects.map(normalizeProject),
    };
  },
  mine: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<
      Project[] | { data: Project[] } | { projects: Project[] }
    >(Endpoints.projects.mine);
    return unwrap<Project[]>(data).map(normalizeProject);
  },
  get: async (id: string): Promise<Project> => {
    const { data } = await apiClient.get<
      Project | { data: Project } | { project: Project }
    >(Endpoints.projects.detail(id));
    return normalizeProject(unwrap(data));
  },
  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const { data } = await apiClient.post<
      Project | { data: Project } | { project: Project }
    >(Endpoints.projects.create, payload);
    return normalizeProject(unwrap(data));
  },
  uploadReport: async (
    projectId: string,
    file: { uri: string; name: string; mimeType: string },
  ) => {
    const { data } = await apiClient.post<
      PresignedUpload | { data: PresignedUpload }
    >(Endpoints.uploads.projectFile, {
      projectId,
      fileName: file.name,
      contentType: file.mimeType,
    });
    const upload = normalizeUpload(data);
    if (!upload.uploadUrl) {
      throw new Error("The server did not return a PDF upload URL.");
    }
    const result = await FileSystem.uploadAsync(upload.uploadUrl, file.uri, {
      httpMethod: "PUT",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: { "Content-Type": file.mimeType },
    });
    if (result.status < 200 || result.status >= 300) {
      throw new Error(
        result.body || `PDF upload failed with status ${result.status}.`,
      );
    }
    return upload.fileUrl ?? upload.key;
  },
  update: async (
    id: string,
    payload: Partial<CreateProjectPayload>,
  ): Promise<Project> => {
    const { data } = await apiClient.patch<
      Project | { data: Project } | { project: Project }
    >(Endpoints.projects.update(id), payload);
    return normalizeProject(unwrap(data));
  },
  submit: async (id: string): Promise<Project> => {
    const { data } = await apiClient.post<
      Project | { data: Project } | { project: Project }
    >(Endpoints.projects.submit(id));
    return normalizeProject(unwrap(data));
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(Endpoints.projects.delete(id));
  },
  reviewQueue: async (): Promise<Project[]> => {
    const { data } = await apiClient.get<
      Project[] | { data: Project[] } | { projects: Project[] }
    >(Endpoints.projects.reviewQueue);
    return unwrap<Project[]>(data).map(normalizeProject);
  },
  moderate: async (
    id: string,
    action: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED",
    comment?: string,
  ): Promise<Project> => {
    const { data } = await apiClient.patch<Project | { project: Project }>(
      Endpoints.moderation.review(id),
      { action, comment },
    );
    return normalizeProject(unwrap(data));
  },
};
