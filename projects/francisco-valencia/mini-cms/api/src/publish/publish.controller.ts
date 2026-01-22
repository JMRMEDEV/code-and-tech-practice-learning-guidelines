import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PublishService } from './publish.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Publishing')
@Controller()
export class PublishController {
  constructor(private readonly publishService: PublishService) {}

  @Post('pages/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a page to static JSON' })
  @ApiResponse({ status: 201, description: 'Page successfully published' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  publishPage(@Param('id') pageId: string, @CurrentUser() user: User) {
    return this.publishService.publishPage(pageId, user._id.toString());
  }

  @Delete('pages/:id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unpublish a page (remove static JSON)' })
  @ApiResponse({ status: 204, description: 'Page successfully unpublished' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async unpublishPage(@Param('id') pageId: string, @CurrentUser() user: User) {
    await this.publishService.unpublishPage(pageId, user._id.toString());
  }

  @Post('pages/:id/republish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Republish a page (update static JSON)' })
  @ApiResponse({ status: 200, description: 'Page successfully republished' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  republishPage(@Param('id') pageId: string, @CurrentUser() user: User) {
    return this.publishService.republishPage(pageId, user._id.toString());
  }

  @Get('published/:slug')
  @ApiOperation({ summary: 'Get published page by slug (public endpoint)' })
  @ApiResponse({ status: 200, description: 'Published page data' })
  @ApiResponse({ status: 404, description: 'Published page not found' })
  getPublishedPage(@Param('slug') slug: string) {
    return this.publishService.getPublishedPage(slug);
  }

  @Get('published')
  @ApiOperation({ summary: 'List all published pages (public endpoint)' })
  @ApiResponse({ status: 200, description: 'List of published page slugs' })
  listPublishedPages() {
    return this.publishService.listPublishedPages();
  }
}