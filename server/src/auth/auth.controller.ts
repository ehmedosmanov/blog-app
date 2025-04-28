import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { CustomResponse } from '../common/dto/custom-response.dto';
import { User } from '../users/entity/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserDto } from './dtos/current-user.dto';
import { SetMessage } from 'src/common/decorators/set-message.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: [User],
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists with this email',
  })
  @SetMessage('User registered in successfully')
  async register(@Body() body: RegisterDto) {
    const res = await this.authService.register(body);
    return res;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @SetMessage('User logged in successfully')
  async login(@Body() body: LoginDto) {
    const res = await this.authService.login(body);
    return res;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the user profile',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
  })
  async getMe(@CurrentUser() user: CurrentUserDto) {
    return await this.authService.getCurrentUser(user);
  }
}
