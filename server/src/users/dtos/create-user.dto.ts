import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'User' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Surname' })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString()
  surname: string;

  @ApiProperty({ example: 'just@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is 6 characters',
  })
  password: string;
}
