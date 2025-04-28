import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'User', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Surname' })
  @IsOptional()
  @IsString()
  surname: string;

  @ApiProperty({ example: 'just@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password321', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters',
  })
  password?: string;
}
