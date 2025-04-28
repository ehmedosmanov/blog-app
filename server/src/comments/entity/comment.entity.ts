import { ApiProperty } from '@nestjs/swagger';
import { CommentLike } from '../../comment-likes/entity/comment-like.entity';
import { BaseEntity } from '../../common/base.entity';
import { Post } from '../../posts/entity/post.entity';
import { User } from '../../users/entity/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity('comments')
export class Comment extends BaseEntity {

  @ApiProperty()
  @Column('text')
  content: string;

  @ApiProperty()
  @Column({ default: 0 })
  like_count: number;

  @ApiProperty({ type: () => Post })
  @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ApiProperty()
  @Column()
  postId: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: () => [CommentLike] })
  @OneToMany(() => CommentLike, like => like.comment, { cascade: true })
  likes: CommentLike[];

}
