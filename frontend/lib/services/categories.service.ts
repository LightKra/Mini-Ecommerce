import api from './config';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './types';

export const categoriesService = {
  /**
   * Create a new category (admin only)
   */
  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  /**
   * Get all categories
   */
  async findAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get a category by ID
   */
  async findOne(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  /**
   * Get a category by slug
   */
  async findBySlug(slug: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  /**
   * Update a category (admin only)
   */
  async update(id: number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category (admin only)
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default categoriesService;

