import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from './entity/comment-like.entity';
import { CreateCommentLikeDto } from './dtos/create-comment-like.dto';
import { User } from '../users/entity/user.entity';
import { Comment } from '../comments/entity/comment.entity';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
@Injectable()
export class CommentLikesService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private async findCommentAndLike(
    commentId: number,
    userId: number,
  ): Promise<{ comment: Comment; existingLike: CommentLike | null }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    const existingLike = await this.commentLikeRepository.findOne({
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    return { comment, existingLike };
  }

  async create(
    createCommentLikeDto: CreateCommentLikeDto,
    user: CurrentUserDto,
  ): Promise<CommentLike> {
    const { commentId, isLike = true } = createCommentLikeDto;

    const { comment, existingLike } = await this.findCommentAndLike(
      commentId,
      user.userId,
    );

    if (existingLike) {
      if (existingLike.is_like !== isLike) {
        existingLike.is_like = isLike;
        return this.commentLikeRepository.save(existingLike);
      }

      throw new BadRequestException(
        `You have already ${isLike ? 'liked' : 'disliked'} this comment`,
      );
    }

    const like = this.commentLikeRepository.create({
      comment,
      user: { id: user.userId },
      is_like: isLike,
    });

    await this.commentLikeRepository.save(like);

    comment.like_count += isLike ? 1 : -1;
    await this.commentRepository.save(comment);

    return like;
  }

  async remove(commentId: number, user: CurrentUserDto): Promise<void> {
    const { comment, existingLike } = await this.findCommentAndLike(
      commentId,
      user.userId,
    );

    if (!existingLike) {
      throw new NotFoundException('You have not liked this comment');
    }

    await this.commentLikeRepository.remove(existingLike);

    comment.like_count -= existingLike.is_like ? 1 : -1;
    await this.commentRepository.save(comment);
  }

  async findByCommentId(commentId: number): Promise<CommentLike[]> {
    return this.commentLikeRepository.find({
      where: { comment: { id: commentId } },
      relations: ['user'],
    });
  }

  async findByUserId(userId: number): Promise<CommentLike[]> {
    return this.commentLikeRepository.find({
      where: { user: { id: userId } },
      relations: ['comment'],
    });
  }

  async checkUserLiked(
    commentId: number,
    userId: number,
  ): Promise<{ liked: boolean; isLike?: boolean }> {
    const like = await this.commentLikeRepository.findOne({
      where: {
        user: { id: userId },
        comment: { id: commentId },
      },
    });

    return {
      liked: !!like,
      isLike: like?.is_like,
    };
  }
}
