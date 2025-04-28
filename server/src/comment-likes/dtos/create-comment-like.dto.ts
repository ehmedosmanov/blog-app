import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentLikeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'CommentId is required' })
  commentId: number;

  
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isLike?: boolean;
}
