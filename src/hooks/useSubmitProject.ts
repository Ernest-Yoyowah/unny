import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProjectService,
  CreateProjectPayload,
} from "../api/services/project.service";
import { PROJECTS_KEY } from "./useProject";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      ProjectService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
};

export const useSubmitProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectService.submit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROJECTS_KEY }),
  });
};
