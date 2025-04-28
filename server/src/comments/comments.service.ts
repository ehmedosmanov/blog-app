import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { Post } from '../posts/entity/post.entity';
import { CommentFilterDto } from './dtos/comment-filter.dto';
import { PAGINATION_VALUES } from '../constants/pagination.constant';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { MetadataDto } from 'src/common/dto/metadata.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: CurrentUserDto,
  ): Promise<Comment> {
    const { content, postSlug } = createCommentDto;

    console.log('Create comment user', user);

    try {
      const post = await this.postRepository.findOne({
        where: { slug: postSlug },
      });

      if (!post) {
        throw new NotFoundException(`Post with slug ${postSlug} not found`);
      }

      const comment = this.commentRepository.create({
        content,
        post,
        user: { id: user.userId },
        likes: [],
        like_count: 0,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const savedComment = await this.commentRepository.save(comment);
      return savedComment;
    } catch (error) {
      console.error('Error saving comment:', error);
      throw new BadRequestException('Failed to create comment');
    }
  }

  async findByPostId(
    postId: number,
    filterDto: CommentFilterDto,
  ): Promise<{ data: Comment[]; metadata: MetadataDto }> {
    const {
      page = PAGINATION_VALUES.page,
      limit = PAGINATION_VALUES.limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const post = await this.postRepository.findOne({
      where: { id: +postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with Id ${postId} not found`);
    }

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.post.id = :postId', { postId })
      .orderBy(`comment.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [comments, totalCount] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: comments,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async findByPostSlug(
    postSlug: string,
    filterDto: CommentFilterDto,
  ): Promise<{ data: Comment[]; metadata: MetadataDto }> {
    const {
      page = PAGINATION_VALUES.page,
      limit = PAGINATION_VALUES.limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const post = await this.postRepository.findOne({
      where: { slug: postSlug },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException(`Post with slug ${postSlug} not found`);
    }

    const [comments, totalCount] = await this.commentRepository.findAndCount({
      where: {
        postId: post.id,
      },
      relations: ['user', 'post'],
      order: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: comments,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async findById(id: number, postId?: number): Promise<Comment> {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.id = :id', { id });

    if (postId) {
      queryBuilder.andWhere('post.id = :postId', { postId });
    }

    const comment = await queryBuilder.getOne();

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: CurrentUserDto,
  ): Promise<Comment> {
    const comment = await this.findById(id);

    if (comment.user.id !== user.userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    const updatedComment = this.commentRepository.merge(
      comment,
      updateCommentDto,
    );

    return this.commentRepository.save(updatedComment);
  }

  async remove(id: number, user: CurrentUserDto): Promise<void> {
    const comment = await this.findById(id);

    if (comment.user.id !== user.userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const result = await this.commentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Comment with Id ${id} not found`);
    }
  }

  async findByUserId(
    userId: string | number,
    filterDto: CommentFilterDto,
  ): Promise<{ data: Comment[]; metadata: any }> {
    const {
      page = PAGINATION_VALUES.page,
      limit = PAGINATION_VALUES.limit,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      postId,
    } = filterDto;

    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.user.id = :userId', { userId: Number(userId) });

    if (postId) {
      queryBuilder.andWhere('post.id = :postId', { postId });
    }

    queryBuilder
      .orderBy(`comment.${sortBy}`, sortOrder as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [comments, totalCount] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: comments,
      metadata: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    };
  }

  async countPostComments(postId: number): Promise<number> {
    const count = await this.commentRepository.count({
      where: { post: { id: postId } },
    });
    return count;
  }
}
