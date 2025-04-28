import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const isUserExist = await this.userRepository.findOne({
      where: { email: email },
    });

    if (isUserExist) {
      throw new BadRequestException('This user already exist with this email');
    }

    //! no need to hash password, entity hooks will handle it (BeforeInsert, BeforeUpdate)
    const newUser = this.userRepository.create(createUserDto);

    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password'],
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _, ...result } = user;
        return result as User;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
