import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../lib/services";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductImageRequest,
  ProductQueryParams,
} from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch all products with pagination and filters
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsService.findAll(params),
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to fetch a product by slug
 */
export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.slug(slug),
    queryFn: () => productsService.findBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productsService.update(id, data),
    onSuccess: (updatedProduct, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      // Also invalidate slug-based query if slug exists
      if (updatedProduct.slug) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.slug(updatedProduct.slug),
        });
      }
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/**
 * Hook to add an image to a product
 */
export function useAddProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: number;
      data: CreateProductImageRequest;
    }) => productsService.addImage(productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Hook to remove an image from a product
 */
export function useRemoveProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: number;
      imageId: number;
    }) => productsService.removeImage(productId, imageId),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
