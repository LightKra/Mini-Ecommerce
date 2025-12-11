import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../lib/services";
import type { AddToCartRequest, UpdateCartItemRequest } from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch the current user's cart
 */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.detail(),
    queryFn: () => cartService.getCart(),
  });
}

/**
 * Hook to fetch the cart total
 */
export function useCartTotal() {
  return useQuery({
    queryKey: queryKeys.cart.total(),
    queryFn: () => cartService.getCartTotal(),
  });
}

/**
 * Hook to add a product to the cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addToCart(data),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.detail(), cart);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.total() });
    },
  });
}

/**
 * Hook to update a cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: UpdateCartItemRequest;
    }) => cartService.updateCartItem(itemId, data),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.detail(), cart);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.total() });
    },
  });
}

/**
 * Hook to remove an item from the cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartService.removeFromCart(itemId),
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.detail(), cart);
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.total() });
    },
  });
}

/**
 * Hook to clear the entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
