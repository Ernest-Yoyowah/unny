import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "../api/services/project.service";

export const PROJECTS_KEY = ["projects"];

export const useProject = (projectId: string, enabled = true) =>
  useQuery({
    queryKey: [...PROJECTS_KEY, "detail", projectId],
    queryFn: () => ProjectService.get(projectId),
    enabled: Boolean(projectId) && enabled,
  });

export const useExploreProjects = (
  params?: Parameters<typeof ProjectService.explore>[0],
) =>
  useQuery({
    queryKey: [...PROJECTS_KEY, "explore", params],
    queryFn: () => ProjectService.explore(params),
  });

export const useMyProjects = () =>
  useQuery({
    queryKey: [...PROJECTS_KEY, "mine"],
    queryFn: ProjectService.mine,
  });
