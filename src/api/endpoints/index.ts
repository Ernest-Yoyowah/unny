export const Endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
    me: "/auth/me",
  },

  users: {
    me: "/users/me",
    profile: (id: string) => `/users/${id}`,
    updateProfile: "/users/me",
    uploadAvatar: "/users/me/avatar",
  },

  organizations: {
    list: "/organizations",
    detail: (id: string) => `/organizations/${id}`,
    create: "/organizations",
    update: (id: string) => `/organizations/${id}`,
    submitVerification: (id: string) => `/organizations/${id}/verification`,
    join: "/organizations/join",
    members: (id: string) => `/organizations/${id}/members`,
    removeMember: (orgId: string, userId: string) =>
      `/organizations/${orgId}/members/${userId}`,
  },

  courses: {
    list: "/courses",
    detail: (id: string) => `/courses/${id}`,
    create: "/courses",
    update: (id: string) => `/courses/${id}`,
    archive: (id: string) => `/courses/${id}/archive`,
    enroll: (id: string) => `/courses/${id}/enroll`,
    unenroll: (id: string) => `/courses/${id}/unenroll`,
    students: (id: string) => `/courses/${id}/students`,
    pin: (id: string) => `/courses/${id}/pin`,
    unpin: (id: string) => `/courses/${id}/unpin`,
  },

  documents: {
    list: (courseId: string) => `/courses/${courseId}/documents`,
    detail: (id: string) => `/documents/${id}`,
    upload: (courseId: string) => `/courses/${courseId}/documents`,
    delete: (id: string) => `/documents/${id}`,
    download: (id: string) => `/documents/${id}/download-url`,
  },

  notifications: {
    list: "/notifications",
    detail: (id: string) => `/notifications/${id}`,
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
    devices: "/notifications/devices",
  },

  projects: {
    create: "/projects",
    detail: (id: string) => `/projects/${id}`,
    update: (id: string) => `/projects/${id}`,
    explore: "/projects/explore",
    mine: "/projects/mine",
    reviewQueue: "/projects/review-queue",
    submit: (id: string) => `/projects/${id}/submit`,
    delete: (id: string) => `/projects/${id}`,
    comments: (id: string) => `/projects/${id}/comments`,
    bookmark: (id: string) => `/projects/${id}/bookmark`,
    bookmarks: "/projects/bookmarks",
    reviews: (id: string) => `/projects/${id}/reviews`,
    collaborators: (id: string) => `/projects/${id}/collaborators`,
    supervision: (id: string) => `/projects/${id}/supervision-requests`,
  },

  collaborationInvites: {
    respond: (id: string) => `/collaboration-invites/${id}`,
  },

  moderation: {
    queue: "/moderation/queue",
    review: (projectId: string) => `/moderation/${projectId}`,
  },

  tags: {
    list: "/tags",
    create: "/tags",
  },

  uploads: {
    projectFile: "/uploads/project-file",
    avatar: "/uploads/avatar",
  },

  explore: {
    users: "/explore",
  },
} as const;
