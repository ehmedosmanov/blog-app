import apiClient from '@/api';
import { ApiResponse } from '@/api/types';
import {
  Comment,
  CommentsParams,
  CreateCommentDto,
  UpdateCommentDto,
} from './types';

export const commentsService = {
  async getCommentsByPostSlug(
    postSlug: string,
    params: CommentsParams = {}
  ): Promise<ApiResponse<Comment[]>> {
    return apiClient.get(`/comments/post/getComments/${postSlug}`, { params });
  },

  async createComment(data: CreateCommentDto): Promise<Comment> {
    return apiClient.post('/comments/create', data);
  },

  async updateComment(id: number, data: UpdateCommentDto): Promise<Comment> {
    return apiClient.patch(`/comments/comment/update/${id}`, data);
  },

  async deleteComment(id: number): Promise<void> {
    return apiClient.delete(`/comments/comment/delete/${id}`);
  },
};
