import { Entity } from '@/api/types';
import { Post } from '../posts/types';
import { User } from '../auth/types';

export type Comment = Entity<{
  id: number;
  content: string;
  like_count: number;
  isLiked?: boolean;
  user?: User;
  post?: Post;
  createdAt: string;
  updatedAt: string;
}>;

export interface CommentsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateCommentDto {
  content: string;
  postSlug: string;
}

export interface UpdateCommentDto {
  content: string;
}
