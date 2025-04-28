export interface ApiResponseMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  metadata: ApiResponseMetadata;
  message: string;
  success: boolean;
}

export type BaseEntityType = {
  id: number;
  createdAt: string;
  updatedAt: string;

};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntityType;
