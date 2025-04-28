import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entity/user.entity';
import { Comment } from '../../comments/entity/comment.entity';

@Entity('comment_likes')
export class CommentLike extends BaseEntity {
  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: true })
  is_like: boolean;
}
