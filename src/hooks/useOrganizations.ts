import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrganizationsService } from "../api/services/organizations.service";
import { CreateOrganizationPayload } from "../types/organization.types";

export const ORGANIZATIONS_KEY = "organizations";

export const useOrganizations = (params?: { search?: string; page?: number }) =>
  useQuery({
    queryKey: [ORGANIZATIONS_KEY, "list", params],
    queryFn: () => OrganizationsService.getOrganizations(params),
  });

export const useOrganization = (id: string) =>
  useQuery({
    queryKey: [ORGANIZATIONS_KEY, "detail", id],
    queryFn: () => OrganizationsService.getOrganization(id),
    enabled: !!id,
  });

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) =>
      OrganizationsService.createOrganization(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [ORGANIZATIONS_KEY] }),
  });
};

export const useJoinOrganization = () =>
  useMutation({
    mutationFn: (joinCode: string) =>
      OrganizationsService.joinOrganization(joinCode),
  });
