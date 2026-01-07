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
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@ApiTags('Sections')
@Controller('sections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new section' })
  @ApiResponse({ status: 201, description: 'Section successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid section data' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createSectionDto: CreateSectionDto, @CurrentUser() user: User) {
    return this.sectionsService.create(createSectionDto, user._id.toString());
  }

  @Get('page/:pageId')
  @ApiOperation({ summary: 'Get all sections for a page' })
  @ApiResponse({ status: 200, description: 'List of sections ordered by position' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByPage(@Param('pageId') pageId: string) {
    return this.sectionsService.findByPage(pageId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific section by ID' })
  @ApiResponse({ status: 200, description: 'Section details' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a section' })
  @ApiResponse({ status: 200, description: 'Section successfully updated' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid section data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
    @CurrentUser() user: User,
  ) {
    return this.sectionsService.update(id, updateSectionDto, user._id.toString());
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a section' })
  @ApiResponse({ status: 200, description: 'Section successfully deleted' })
  @ApiResponse({ status: 404, description: 'Section not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sectionsService.remove(id, user._id.toString());
  }

  @Post('page/:pageId/reorder')
  @ApiOperation({ summary: 'Reorder sections within a page' })
  @ApiResponse({ status: 200, description: 'Sections successfully reordered' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your page' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  reorder(
    @Param('pageId') pageId: string,
    @Body() reorderDto: ReorderSectionsDto,
    @CurrentUser() user: User,
  ) {
    return this.sectionsService.reorderSections(pageId, reorderDto.sectionIds);
  }
}