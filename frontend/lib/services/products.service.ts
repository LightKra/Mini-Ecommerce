import api from './config';
import type {
  Product,
  ProductImage,
  CreateProductRequest,
  UpdateProductRequest,
  CreateProductImageRequest,
  ProductQueryParams,
  PaginatedResponse,
} from './types';

export const productsService = {
  /**
   * Create a new product (admin only)
   */
  async create(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  /**
   * Get all products with pagination and filters
   */
  async findAll(
    params?: ProductQueryParams
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', {
      params,
    });
    return response.data;
  },

  /**
   * Get a product by ID
   */
  async findOne(id: number): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Get a product by slug
   */
  async findBySlug(slug: string): Promise<Product> {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  /**
   * Update a product (admin only)
   */
  async update(id: number, data: UpdateProductRequest): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product (admin only)
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  /**
   * Add an image to a product (admin only)
   */
  async addImage(
    productId: number,
    data: CreateProductImageRequest
  ): Promise<ProductImage> {
    const response = await api.post<ProductImage>(
      `/products/${productId}/images`,
      data
    );
    return response.data;
  },

  /**
   * Remove an image from a product (admin only)
   */
  async removeImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`/products/${productId}/images/${imageId}`);
  },
};

export default productsService;

