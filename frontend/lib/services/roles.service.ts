import api from './config';
import type { Role, CreateRoleRequest, UpdateRoleRequest } from './types';

export const rolesService = {
  /**
   * Create a new role
   */
  async create(data: CreateRoleRequest): Promise<Role> {
    const response = await api.post<Role>('/roles', data);
    return response.data;
  },

  /**
   * Get all roles
   */
  async findAll(): Promise<Role[]> {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  },

  /**
   * Get a role by ID
   */
  async findOne(id: number): Promise<Role> {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },

  /**
   * Update a role
   */
  async update(id: number, data: UpdateRoleRequest): Promise<Role> {
    const response = await api.patch<Role>(`/roles/${id}`, data);
    return response.data;
  },

  /**
   * Delete a role
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/roles/${id}`);
  },
};

export default rolesService;

