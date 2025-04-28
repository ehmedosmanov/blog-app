import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dtos/current-user.dto';
import { CustomResponse } from '../common/dto/custom-response.dto';
import { CommentFilterDto } from './dtos/comment-filter.dto';
import { SortOrder } from '../enum/sort.enum';
import { SetMessage } from 'src/common/decorators/set-message.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @SetMessage('Comment created successfully')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const comment = await this.commentsService.create(createCommentDto, user);
    return comment;
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments by postId' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiResponse({
    status: 200,
    description: 'Returns comments for a specific post',
  })
  @SetMessage('Comments retrieved successfully')
  async findByPostId(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() filterDto: CommentFilterDto,
  ) {
    const result = await this.commentsService.findByPostId(postId, filterDto);
    return result;
  }

  @Get('post/:postId/count')
  @ApiOperation({ summary: 'Get comment count for a post' })
  @ApiParam({ name: 'postId', type: Number, description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the number of comments for a post',
  })
  async countPostComments(@Param('postId', ParseIntPipe) postId: number) {
    const count = await this.commentsService.countPostComments(postId);
    return new CustomResponse(
      { count },
      'Comment count retrieved successfully',
    );
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by userId' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'postId',
    required: false,
    type: Number,
    description: 'Filter by post ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns comments created by user',
  })
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() filterDto: CommentFilterDto,
  ) {
    const result = await this.commentsService.findByUserId(userId, filterDto);
    return new CustomResponse(result, 'Comments retrieved successfully');
  }

  @Patch('comment/update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a comment for a specific post' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only update your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found for this post',
  })
  @SetMessage('Comment updated succesfully')
  async updateForPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const comment = await this.commentsService.update(
      id,
      updateCommentDto,
      user
    );
    return comment
  }

  @Delete('comment/delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a comment for post' })
  @ApiParam({ name: 'id', type: Number, description: 'Comment ID' })
  @ApiResponse({
    status: 200,
    description: 'Comment deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You can only delete your own comments',
  })
  @ApiResponse({
    status: 404,
    description: 'Comment not found for this post',
  })
  @SetMessage('Comment deleted')
  async removeFromPost(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const res = await this.commentsService.remove(id, user);
    return res;
  }

  @Get('post/getComments/:postSlug')
  @ApiOperation({ summary: 'Get comments by post slug' })
  @ApiParam({ name: 'postSlug', type: String, description: 'Post Slug' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiResponse({
    status: 200,
    description: 'Returns comments for a specific post by slug',
  })
  @SetMessage('Comments retrieved successfully')
  async findByPostSlug(
    @Param('postSlug') postSlug: string,
    @Query() filterDto: CommentFilterDto,
  ) {
    console.log('what is slug event aobut', postSlug);
    const result = await this.commentsService.findByPostSlug(
      postSlug,
      filterDto,
    );
    return result;
  }
}
