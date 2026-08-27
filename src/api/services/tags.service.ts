import { apiClient } from "../client";
import { Endpoints } from "../endpoints";

export interface Tag {
  id: string;
  name: string;
  category?: string;
}

export const TagsService = {
  list: async (): Promise<Tag[]> => {
    const { data } = await apiClient.get<Tag[] | { data: Tag[] }>(
      Endpoints.tags.list,
    );
    return Array.isArray(data) ? data : data.data;
  },
  create: async (name: string, category = "FRAMEWORK"): Promise<Tag> => {
    const { data } = await apiClient.post<Tag | { data: Tag }>(
      Endpoints.tags.create,
      { name, category },
    );
    return "data" in data ? data.data : data;
  },
};
