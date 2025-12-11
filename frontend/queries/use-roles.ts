import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesService } from "../lib/services";
import type { CreateRoleRequest, UpdateRoleRequest } from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch all roles
 */
export function useRoles() {
  return useQuery({
    queryKey: queryKeys.roles.list(),
    queryFn: () => rolesService.findAll(),
  });
}

/**
 * Hook to fetch a single role by ID
 */
export function useRole(id: number) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => rolesService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
}

/**
 * Hook to update a role
 */
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleRequest }) =>
      rolesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
    },
  });
}
