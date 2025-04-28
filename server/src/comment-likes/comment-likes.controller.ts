import {
  Controller,
  Post as HttpPost,
  Delete,
  Param,
  Body,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { CommentLikesService } from './comment-likes.service';
import { CreateCommentLikeDto } from './dtos/create-comment-like.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CommentLike } from './entity/comment-like.entity';
import { CustomResponse } from 'src/common/dto/custom-response.dto';
import { CurrentUserDto } from 'src/auth/dtos/current-user.dto';
import { SetMessage } from 'src/common/decorators/set-message.decorator';

@ApiTags('Comment Likes')
@Controller('comment-likes')
export class CommentLikesController {
  constructor(private readonly commentLikesService: CommentLikesService) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({
    status: 201,
    description: 'Successfully liked the comment',
  })
  async create(
    @Body() createCommentLikeDto: CreateCommentLikeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const commentLikes = await this.commentLikesService.create(
      createCommentLikeDto,
      user,
    );
    return new CustomResponse(commentLikes, 'Comment liked successfully');
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({
    status: 200,
    description: 'Successfully unliked the comment',
  })
  async remove(
    @Param('commentId') commentId: number,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    return this.commentLikesService.remove(commentId, user);
  }

  @Get('comment/:commentId')
  @ApiOperation({ summary: 'Get all likes for a comment' })
  @ApiResponse({
    status: 200,
    description: 'List of likes for the comment',
  })
  async findByCommentId(
    @Param('commentId') commentId: number,
  ): Promise<CommentLike[]> {
    return this.commentLikesService.findByCommentId(commentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all likes by a user' })
  @ApiResponse({
    status: 200,
    description: 'List of likes by the user',
    type: [CommentLike],
  })
  async findByUserId(@Param('userId') userId: number): Promise<CommentLike[]> {
    return this.commentLikesService.findByUserId(userId);
  }

  @Get('check/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Check if a user has liked a comment' })
  @ApiResponse({
    status: 200,
    description: 'Returns information about users like status',
  })
  @SetMessage('Information about users like returned successufully')
  async checkUserLiked(
    @Param('commentId') commentId: number,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<{ liked: boolean; isLike?: boolean }> {
    return this.commentLikesService.checkUserLiked(commentId, user.userId);
  }
}
