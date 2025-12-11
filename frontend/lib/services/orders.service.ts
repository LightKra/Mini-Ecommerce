import api from './config';
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest } from './types';

export const ordersService = {
  /**
   * Create a new order from cart
   */
  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Get all orders for current user
   */
  async findAll(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  /**
   * Get all orders (admin only)
   */
  async findAllAdmin(): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders/admin');
    return response.data;
  },

  /**
   * Get an order by ID
   */
  async findOne(id: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  /**
   * Update order status (admin only)
   */
  async updateStatus(
    id: number,
    data: UpdateOrderStatusRequest
  ): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  /**
   * Cancel an order
   */
  async cancel(id: number): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default ordersService;

