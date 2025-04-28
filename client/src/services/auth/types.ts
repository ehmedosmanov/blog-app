import { Entity } from '@/api/types';

export type AccessTokenResponse = {
  access_token: string;
};

export type User = Entity<{
  name: string;
  email: string;
}>;
