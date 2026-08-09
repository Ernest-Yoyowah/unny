export const Endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
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
  },
} as const;
