import { ApiProperty } from '@nestjs/swagger';

export class MetadataDto {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  limit: number;
}
