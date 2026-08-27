import { useQuery } from "@tanstack/react-query";
import { ExploreService } from "../api/services/explore.service";

export const useExplore = (query = "") =>
  useQuery({
    queryKey: ["explore", query.trim()],
    queryFn: () => ExploreService.search(query),
  });
