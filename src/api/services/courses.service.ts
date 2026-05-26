import { apiClient } from "../client";
import { Endpoints } from "../endpoints";
import {
  Course,
  CreateCoursePayload,
  CourseStudent,
} from "../../types/course.types";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CoursesQueryParams {
  organizationId?: string;
  lecturerId?: string;
  status?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const CoursesService = {
  getCourses: async (
    params?: CoursesQueryParams,
  ): Promise<PaginatedResponse<Course>> => {
    const { data } = await apiClient.get<PaginatedResponse<Course>>(
      Endpoints.courses.list,
      {
        params,
      },
    );
    return data;
  },

  getCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.get<Course>(Endpoints.courses.detail(id));
    return data;
  },

  createCourse: async (payload: CreateCoursePayload): Promise<Course> => {
    const { data } = await apiClient.post<Course>(
      Endpoints.courses.create,
      payload,
    );
    return data;
  },

  updateCourse: async (
    id: string,
    payload: Partial<CreateCoursePayload>,
  ): Promise<Course> => {
    const { data } = await apiClient.patch<Course>(
      Endpoints.courses.update(id),
      payload,
    );
    return data;
  },

  archiveCourse: async (id: string): Promise<Course> => {
    const { data } = await apiClient.post<Course>(
      Endpoints.courses.archive(id),
    );
    return data;
  },

  enrollCourse: async (id: string): Promise<void> => {
    await apiClient.post(Endpoints.courses.enroll(id));
  },

  unenrollCourse: async (id: string): Promise<void> => {
    await apiClient.delete(Endpoints.courses.unenroll(id));
  },

  getCourseStudents: async (
    id: string,
  ): Promise<PaginatedResponse<CourseStudent>> => {
    const { data } = await apiClient.get<PaginatedResponse<CourseStudent>>(
      Endpoints.courses.students(id),
    );
    return data;
  },

  pinCourse: async (id: string): Promise<void> => {
    await apiClient.post(Endpoints.courses.pin(id));
  },

  unpinCourse: async (id: string): Promise<void> => {
    await apiClient.delete(Endpoints.courses.unpin(id));
  },
};
