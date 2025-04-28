import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/entity/comment.entity';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entity/user.entity';
import { Entity, Column, ManyToOne, OneToMany, BeforeInsert } from 'typeorm';

@Entity('posts')
export class Post extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column({ unique: true })
  slug: string;

  @ApiProperty()
  @Column({ nullable: true })
  category: string;

  @ApiProperty()
  @Column({ default: 0 })
  view_count: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
