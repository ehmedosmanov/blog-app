import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from '../users/users.service';
import { CurrentUserDto } from './dtos/current-user.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const { email } = body;

    const isUserExist = await this.userRepository.findOne({
      where: { email },
    });

    if (isUserExist) {
      throw new BadRequestException('This user already exist with this email');
    }

    const user = await this.usersService.create(body);

    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async login(body: LoginDto) {
    const { email, password } = body;

    const user = await this.usersService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };

    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async getCurrentUser(user: CurrentUserDto) {
    const getUserr = await this.userRepository.findOne({
      where: { id: user.userId },
    });
    if (!getUserr) {
      throw new UnauthorizedException('User not found');
    }
    return getUserr;
  }
}
