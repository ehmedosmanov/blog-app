import { Entity } from '@/api/types';
import { Comment } from '../comment/types';
import { User } from '../auth/types';

export type Post = Entity<{
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  category: string;
  user?: User;
  comments?: Comment[];
}>;
