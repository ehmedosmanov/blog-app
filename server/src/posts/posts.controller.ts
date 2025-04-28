import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomResponse } from '../common/dto/custom-response.dto';
import { Post } from './entity/post.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { SortOrder } from '../enum/sort.enum';
import { PostFilterDto } from './dtos/post-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.config';
import { CreatePostDto } from './dtos/create-post.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Request } from 'express';
import { CurrentUserDto } from '../auth/dtos/current-user.dto';
import { SetMessage } from 'src/common/decorators/set-message.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @SetMessage('Posts retrieved successfully')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns all posts',
  })
  async getAllPostsx(@Query() filterDto: PostFilterDto) {
    return await this.postsService.findAll(filterDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts' })
  @SetMessage('Posts retrieved successfully')
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiResponse({
    status: 200,
    description: 'Returns posts matching search query',
  })
  async searchPosts(
    @Query('query') query: string,
    @Query() filterDto: PostFilterDto,
  ) {
    return await this.postsService.searchPosts(query, filterDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns a post by slug',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  async findBySlug(@Param('slug') slug: string) {
    const post = await this.postsService.findBySlug(slug);
    return new CustomResponse(post, 'Post retrieved successfully');
  }

  @HttpPost('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        category: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @SetMessage('Post created successfully')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @CurrentUser() user: CurrentUserDto,
  ) {
    console.log('req in create post', req.user);
    const imageUrl = file
      ? `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      : null;
    const postCreated = await this.postsService.create(
      createPostDto,
      user,
      imageUrl,
    );
    return postCreated
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get posts by userId' })
  @ApiResponse({
    status: 200,
    description: 'Returns posts by userId',
    type: [Post],
  })
  async getByUserId(
    @Param('id') userId: string,
    @Query() filterDto: PostFilterDto,
  ) {
    const posts = await this.postsService.postsByUserId(userId, filterDto);
    return new CustomResponse(posts, 'Posts retrieved successfully');
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete post by slug' })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    type: Post,
  })
  async deletePost(@Param('slug') slug: string) {
    const post = await this.postsService.deletePost(slug);
    return new CustomResponse(post, 'Post deleted successfully');
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get posts by category' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: SortOrder })
  @ApiResponse({
    status: 200,
    description: 'Returns posts by category',
  })
  async getByCategory(
    @Param('category') category: string,
    @Query() filterDto: PostFilterDto,
  ) {
    const posts = await this.postsService.findByCategory(category, filterDto);
    return new CustomResponse(posts, 'Posts retrieved successfully');
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a post' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        category: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async update(
    @Param('slug') slug: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (file) {
      updatePostDto.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    }
    const post = await this.postsService.update(slug, updatePostDto);
    return new CustomResponse(post, 'Post updated successfully');
  }
}
