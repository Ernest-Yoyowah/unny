import * as FileSystem from "expo-file-system/legacy";
import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export type ProjectStatus =
  | "DRAFT"
  | "PENDING REVIEW"
  | "PENDING_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | string;

export const normalizeProjectStatus = (status?: string | null) => {
  const value = (status ?? "").trim();

  if (!value) {
    return "DRAFT";
  }

  const normalized = value.toUpperCase().replace(/\s+/g, "_");

  switch (normalized) {
    case "PENDING_REVIEW":
    case "PENDING REVIEW":
      return "PENDING REVIEW";
    case "CHANGES_REQUESTED":
      return "CHANGES_REQUESTED";
    case "APPROVED":
      return "APPROVED";
    case "REJECTED":
      return "REJECTED";
    case "DRAFT":
      return "DRAFT";
    default:
      return value;
  }
};

export const getProjectStatusPresentation = (status?: string | null) => {
  const normalized = normalizeProjectStatus(status);

  switch (normalized) {
    case "DRAFT":
      return {
        label: "Draft",
        badgeBackground: "rgba(148,163,184,0.12)",
        textColor: "#475569",
        dotColor: "#94A3B8",
      };
    case "PENDING REVIEW":
      return {
        label: "Pending Review",
        badgeBackground: "rgba(245,158,11,0.12)",
        textColor: "#B45309",
        dotColor: "#F59E0B",
      };
    case "CHANGES_REQUESTED":
      return {
        label: "Changes Requested",
        badgeBackground: "rgba(239,68,68,0.12)",
        textColor: "#B91C1C",
        dotColor: "#EF4444",
      };
    case "APPROVED":
      return {
        label: "Approved",
        badgeBackground: "rgba(22,163,74,0.12)",
        textColor: "#15803D",
        dotColor: "#22C55E",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        badgeBackground: "rgba(220,38,38,0.12)",
        textColor: "#B91C1C",
        dotColor: "#EF4444",
      };
    default:
      return {
        label: normalized || "In Progress",
        badgeBackground: "rgba(59,130,246,0.12)",
        textColor: "#1D4ED8",
        dotColor: "#60A5FA",
      };
  }
};

export const isEditableProjectStatus = (status?: string | null) => {
  const normalized = normalizeProjectStatus(status);
  return normalized === "DRAFT" || normalized === "REJECTED";
};

export const getFriendlyFileName = (
  value?: string | null,
  fallback = "Final year report.pdf",
) => {
  const rawValue = value?.split("?")[0]?.split("/").pop() ?? fallback;
  const trimmedValue = rawValue.trim();

  if (!trimmedValue) {
    return fallback;
  }

  const extension = trimmedValue.includes(".")
    ? trimmedValue.slice(trimmedValue.lastIndexOf("."))
    : ".pdf";

  const baseName = trimmedValue.slice(
    0,
    trimmedValue.length - extension.length,
  );
  const sequentialPrefixPattern =
    /^(?:report|document|file|upload|project|attachment|submission)[-_\s]+/i;
  const uuidPattern =
    /(^|[-_\s])[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}(?=[-_\s]|$)/gi;

  let cleaned = baseName
    .replace(uuidPattern, " ")
    .replace(sequentialPrefixPattern, " ")
    .replace(/[._]+/g, " ")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return fallback;
  }

  const words = cleaned
    .split(" ")
    .filter(Boolean)
    .filter((word) => !/^(?:pdf|doc|docx|ppt|pptx)$/i.test(word))
    .map((word) => {
      const lowerWord = word.toLowerCase();
      if (lowerWord === "owasp") {
        return "OWASP";
      }
      if (word.length <= 2) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

  cleaned = words.join(" ").trim();

  if (!cleaned) {
    return fallback;
  }

  return `${cleaned}${extension}`;
};

export const getProjectDocumentTitle = (value?: string | null) =>
  getFriendlyFileName(value, "Final year report.pdf");

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

  const documents =
    project.documents && project.documents.length > 0
      ? project.documents.map((document) => ({
          ...document,
          name: getProjectDocumentTitle(document.name ?? document.title),
          title: getProjectDocumentTitle(document.name ?? document.title),
        }))
      : project.fileUrl || project.fileKey
        ? [
            {
              id: project.id,
              name: getProjectDocumentTitle(project.fileKey ?? project.fileUrl),
              title: getProjectDocumentTitle(
                project.fileKey ?? project.fileUrl,
              ),
              type: "FILE",
              url: project.fileUrl ?? project.fileKey,
            },
          ]
        : [];

  return {
    ...project,
    status: normalizeProjectStatus(project.status),
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
    documents,
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
  fileKey?: string;
}

const normalizeUpload = (
  data: PresignedUpload | { data: PresignedUpload },
): PresignedUpload => ("data" in data ? data.data : data);

export const normalizeStorageUrl = (value?: string) => {
  if (!value) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const isLocalhost = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"].includes(
      parsed.hostname.toLowerCase(),
    );

    if (!isLocalhost) {
      return value;
    }

    const backendOrigin =
      process.env.EXPO_PUBLIC_API_URL ??
      "https://unny-backend-reviced-prototype.onrender.com";

    const resolvedOrigin = backendOrigin.replace(/\/api\/v1\/?$/, "");
    const normalized = new URL(parsed.pathname + parsed.search, resolvedOrigin);
    return normalized.toString();
  } catch {
    return value;
  }
};

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
    const signedUploadUrl = normalizeStorageUrl(upload.uploadUrl);

    if (!signedUploadUrl) {
      throw new Error("The server did not return a PDF upload URL.");
    }

    const result = await FileSystem.uploadAsync(signedUploadUrl, file.uri, {
      httpMethod: "PUT",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: { "Content-Type": file.mimeType },
    });

    if (result.status < 200 || result.status >= 300) {
      throw new Error(
        result.body || `PDF upload failed with status ${result.status}.`,
      );
    }

    const persistedFileUrl = normalizeStorageUrl(
      upload.fileUrl ?? upload.key ?? upload.fileKey,
    );

    if (persistedFileUrl) {
      await ProjectService.update(projectId, {
        fileUrl: persistedFileUrl,
        fileKey: upload.key ?? upload.fileKey,
      });
    }

    return persistedFileUrl ?? signedUploadUrl;
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
