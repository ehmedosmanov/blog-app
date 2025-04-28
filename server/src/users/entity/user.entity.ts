import { ApiProperty } from '@nestjs/swagger';
import { CommentLike } from '../../comment-likes/entity/comment-like.entity';
import { Comment } from '../../comments/entity/comment.entity';
import { BaseEntity } from '../../common/base.entity';
import { Post } from '../../posts/entity/post.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  surname: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Column({ select: false })
  password: string;

  @ApiProperty({ type: () => [Post] })
  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @ApiProperty({ type: () => [CommentLike] })
  @OneToMany(() => CommentLike, (like) => like.user, { cascade: true })
  commentLikes: CommentLike[];

  @BeforeInsert()
  @BeforeUpdate()
  passwordBcrypt() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  }
}
