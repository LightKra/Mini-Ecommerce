import api from './config';
import type {
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
} from './types';

export const addressesService = {
  /**
   * Create a new address
   */
  async create(data: CreateAddressRequest): Promise<Address> {
    const response = await api.post<Address>('/addresses', data);
    return response.data;
  },

  /**
   * Get all addresses for current user
   */
  async findAll(): Promise<Address[]> {
    const response = await api.get<Address[]>('/addresses');
    return response.data;
  },

  /**
   * Get an address by ID
   */
  async findOne(id: number): Promise<Address> {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  /**
   * Update an address
   */
  async update(id: number, data: UpdateAddressRequest): Promise<Address> {
    const response = await api.patch<Address>(`/addresses/${id}`, data);
    return response.data;
  },

  /**
   * Delete an address
   */
  async remove(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};

export default addressesService;

