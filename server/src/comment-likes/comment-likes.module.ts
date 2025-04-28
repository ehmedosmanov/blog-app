import { Module } from '@nestjs/common';
import { CommentLikesController } from './comment-likes.controller';
import { CommentLikesService } from './comment-likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from './entity/comment-like.entity';
import { Comment } from '../comments/entity/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentLike, Comment]),
    AuthModule,
    JwtModule,
  ],
  controllers: [CommentLikesController],
  providers: [CommentLikesService],
  exports: [CommentLikesService],
})
export class CommentLikesModule {}
