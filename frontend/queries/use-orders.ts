import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../lib/services";
import type {
  CreateOrderRequest,
  UpdateOrderStatusRequest,
} from "../lib/services";
import { queryKeys } from "./query-keys";

/**
 * Hook to fetch all orders for the current user
 */
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.list(),
    queryFn: () => ordersService.findAll(),
  });
}

/**
 * Hook to fetch all orders (admin only)
 */
export function useAdminOrders() {
  return useQuery({
    queryKey: queryKeys.orders.adminList(),
    queryFn: () => ordersService.findAllAdmin(),
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersService.findOne(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new order from cart
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      // Clear cart after successful order creation
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Hook to update order status (admin only)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusRequest;
    }) => ordersService.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.adminList() });
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ordersService.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.adminList() });
    },
  });
}
