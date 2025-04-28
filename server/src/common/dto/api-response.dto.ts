import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'Response' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data?: T | T[] | null;

  @ApiProperty()
  metadata?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };

  constructor(
    data: T | T[] | null,
    message: string,
    success: boolean,
    metadata?: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    },
  ) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.metadata = metadata;
  }
}
