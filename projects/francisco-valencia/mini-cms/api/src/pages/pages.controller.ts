import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Pages')
@Controller('pages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({ status: 201, description: 'Page successfully created' })
  @ApiResponse({ status: 409, description: 'Page with this slug already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPageDto: CreatePageDto, @CurrentUser() user: User) {
    return this.pagesService.create(createPageDto, user._id.toString());
  }

  @Get()
  @ApiOperation({ summary: 'Get all pages for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of pages' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@CurrentUser() user: User) {
    return this.pagesService.findAll(user._id.toString());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific page by ID' })
  @ApiResponse({ status: 200, description: 'Page details with sections' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pagesService.findOne(id, user._id.toString());
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a page' })
  @ApiResponse({ status: 200, description: 'Page successfully updated' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 409, description: 'Page with this slug already exists' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
    @CurrentUser() user: User,
  ) {
    return this.pagesService.update(id, updatePageDto, user._id.toString());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a page' })
  @ApiResponse({ status: 200, description: 'Page successfully deleted' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.pagesService.remove(id, user._id.toString());
  }
}