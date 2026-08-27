import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TagsService } from "../api/services/tags.service";

export const useTags = () =>
  useQuery({ queryKey: ["tags"], queryFn: TagsService.list });

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, category }: { name: string; category?: string }) =>
      TagsService.create(name, category),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
};
