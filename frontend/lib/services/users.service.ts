import api from './config';
import type { User, CreateUserRequest, UpdateUserRequest } from './types';

export const usersService = {
  /**
   * Create a new user
   */
  async create(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  },

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  /**
   * Get a user by ID
   */
  async findOne(id: number): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update a user
   */
  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete a user
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};

export default usersService;

