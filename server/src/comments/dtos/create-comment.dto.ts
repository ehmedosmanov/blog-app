import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  @MinLength(2, { message: 'Content must be at least 2 characters long' })
  @MaxLength(1000, { message: 'Content cannot exceed 1000 characters' })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'postSlug is required' })
  @IsString()
  postSlug: string;
}
