import apiClient from '@/api';
import { AccessTokenResponse, User } from './types';
import { ApiResponse } from '@/api/types';

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AccessTokenResponse>> {
    return apiClient.post('/auth/login', { email, password });
  },

  async register(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<ApiResponse<AccessTokenResponse>> {
    return apiClient.post('/auth/register', { name, surname, email, password });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  },
};
