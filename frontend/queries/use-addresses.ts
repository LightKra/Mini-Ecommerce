import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressesService } from "../lib/services";
import type {
  CreateAddressRequest,
  UpdateAddressRequest,
} from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch all addresses for the current user
 */
export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses.list(),
    queryFn: () => addressesService.findAll(),
  });
}

/**
 * Hook to fetch a single address by ID
 */
export function useAddress(id: number) {
  return useQuery({
    queryKey: queryKeys.addresses.detail(id),
    queryFn: () => addressesService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new address
 */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAddressRequest) => addressesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.lists() });
    },
  });
}

/**
 * Hook to update an address
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAddressRequest }) =>
      addressesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.addresses.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.lists() });
    },
  });
}

/**
 * Hook to delete an address
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.lists() });
    },
  });
}
