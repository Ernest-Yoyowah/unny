import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CoursesService,
  CoursesQueryParams,
} from "../api/services/courses.service";
import { CreateCoursePayload } from "../types/course.types";

export const COURSES_KEY = "courses";

export const useCourses = (params?: CoursesQueryParams) =>
  useQuery({
    queryKey: [COURSES_KEY, "list", params],
    queryFn: () => CoursesService.getCourses(params),
  });

export const useCourse = (id: string) =>
  useQuery({
    queryKey: [COURSES_KEY, "detail", id],
    queryFn: () => CoursesService.getCourse(id),
    enabled: !!id,
  });

export const useCourseStudents = (id: string) =>
  useQuery({
    queryKey: [COURSES_KEY, "students", id],
    queryFn: () => CoursesService.getCourseStudents(id),
    enabled: !!id,
  });

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCoursePayload) =>
      CoursesService.createCourse(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY] }),
  });
};

export const useArchiveCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CoursesService.archiveCourse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY] }),
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CoursesService.enrollCourse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY] }),
  });
};

export const useTogglePinCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      isPinned ? CoursesService.unpinCourse(id) : CoursesService.pinCourse(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [COURSES_KEY] }),
  });
};
