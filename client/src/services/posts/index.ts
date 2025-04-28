import apiClient from '@/api';
import { ApiResponse } from '@/api/types';
import { Post } from './types';

interface PostsParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
  category?: string;
}

export const postsService = {
  async getPosts(params: PostsParams = {}): Promise<ApiResponse<Post[]>> {
    return await apiClient.get('/posts', { params });
  },

  async searchPosts(params: PostsParams = {}): Promise<ApiResponse<Post[]>> {
    return await apiClient.get('/posts/search', {
      params,
    });
  },

  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return apiClient.get(`/posts/${slug}`);
  },

  async createPost(formData: FormData): Promise<ApiResponse<Post>> {
    return apiClient.post('/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async updatePost(
    slug: string,
    formData: FormData
  ): Promise<ApiResponse<Post>> {
    return apiClient.put(`/posts/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deletePost(slug: string): Promise<void> {
    return apiClient.delete(`/posts/${slug}`);
  },
};
