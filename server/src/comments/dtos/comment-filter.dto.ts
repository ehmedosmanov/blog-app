import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class CommentFilterDto extends PaginationQueryDto {
  @ApiProperty({
    required: false,
    description: 'Filter comments by post ID',
  })
  @IsOptional()
  postId?: number;

  @ApiProperty({
    required: false,
    description: 'Filter comments by user ID',
  })
  @IsOptional()
  userId?: number;
}
