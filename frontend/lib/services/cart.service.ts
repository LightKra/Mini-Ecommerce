import api from './config';
import type {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartTotalResponse,
} from './types';

export const cartService = {
  /**
   * Get current user's cart
   */
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  /**
   * Add a product to cart
   */
  async addToCart(data: AddToCartRequest): Promise<Cart> {
    const response = await api.post<Cart>('/cart', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(
    itemId: number,
    data: UpdateCartItemRequest
  ): Promise<Cart> {
    const response = await api.patch<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Remove an item from cart
   */
  async removeFromCart(itemId: number): Promise<Cart> {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear cart (remove all items)
   */
  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },

  /**
   * Get cart total
   */
  async getCartTotal(): Promise<CartTotalResponse> {
    const response = await api.get<CartTotalResponse>('/cart/total');
    return response.data;
  },
};

export default cartService;

