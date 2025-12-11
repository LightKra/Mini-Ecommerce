import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../lib/services";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesService.findAll(),
  });
}

/**
 * Hook to fetch a single category by ID
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch a category by slug
 */
export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.categories.slug(slug),
    queryFn: () => categoriesService.findBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
}

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoriesService.update(id, data),
    onSuccess: (updatedCategory, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
      // Also invalidate slug-based query if slug exists
      if (updatedCategory.slug) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories.slug(updatedCategory.slug),
        });
      }
    },
  });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
