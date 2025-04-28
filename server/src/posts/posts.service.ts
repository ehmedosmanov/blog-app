import { MetadataDto } from './../common/dto/metadata.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { PAGINATION_VALUES } from '../constants/pagination.constant';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostFilterDto } from './dtos/post-filter.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import slugify from 'slugify';
import { CurrentUserDto } from '../auth/dtos/current-user.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    user: CurrentUserDto,
    imageUrl: string,
  ): Promise<Post> {
    try {
      const slug = slugify(createPostDto.title, { lower: true, trim: true });

      const newPost = this.postsRepository.create({
        ...createPostDto,
        imageUrl,
        slug,
        user: { id: user.userId },
        comments: [],
      });

      console.log('newPost', newPost);

      return await this.postsRepository.save(newPost);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findBySlug(slug);

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    const updatedUser = this.postsRepository.merge(post, updatePostDto);

    if (updatePostDto.title) {
      updatedUser.slug = slugify(updatePostDto.title, {
        lower: true,
        trim: true,
      });
    }

    return this.postsRepository.save(updatedUser);
  }

  async findAll(
    filterDto: PostFilterDto,
  ): Promise<{ data: Post[]; metadata: MetadataDto }> {
    const {
      page = PAGINATION_VALUES.page,
      limit = PAGINATION_VALUES.limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      category,
      userId,
    } = filterDto;

    const queryBuilder = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user');

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    if (userId) {
      queryBuilder.andWhere('user.id = :userId', { userId: Number(userId) });
    }

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.content ILIKE :search OR post.category ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder.orderBy(`post.${sortBy}`, sortOrder as 'ASC' | 'DESC');
    queryBuilder.skip((page - 1) * limit).take(limit);

    const [posts, totalCount] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: posts,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async findBySlug(slug: string): Promise<Post> {
    try {
      console.log('Finding post with slug:', slug);

      const post = await this.postsRepository.findOne({
        where: { slug },
        relations: ['user'],
      });

      if (!post) {
        throw new NotFoundException(`Post with slug ${slug} not found`);
      }

      await this.postsRepository.increment({ id: post.id }, 'view_count', 1);

      return post;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('Error in post by slug:', error);
      throw new InternalServerErrorException('Unexpected server error');
    }
  }

  async postsByUserId(
    userId: string,
    filterDto: PostFilterDto,
  ): Promise<{ data: Post[]; metadata: MetadataDto }> {
    return this.findAll({
      ...filterDto,
      userId,
    });
  }

  async searchPosts(
    query: string,
    filterDto: PostFilterDto,
  ): Promise<{ data: Post[]; metadata: MetadataDto }> {
    return this.findAll({
      ...filterDto,
      search: query,
    });
  }

  async findByCategory(
    category: string,
    filterDto: PostFilterDto,
  ): Promise<{ data: Post[]; metadata: MetadataDto }> {
    return this.findAll({
      ...filterDto,
      category,
    });
  }

  async deletePost(slug: string): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { slug } });

    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }

    const result = await this.postsRepository.delete(post.id);

    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${post.id} not found`);
    }
  }
}
