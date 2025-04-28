import apiClient from '@/api';
import { User } from '../auth/types';
import { Comment } from '../comment/types';

export interface CommentLike {
  id: number;
  user: User;
  comment: Comment;
  createdAt: string;
}

export const commentLikesService = {
  async likeComment(commentId: number): Promise<CommentLike> {
    return apiClient.post('/comment-likes', { commentId });
  },

  async unlikeComment(commentId: number): Promise<void> {
    return apiClient.delete(`/comment-likes/${commentId}`);
  },
};
