import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Section, SectionDocument, SectionType, TextData, ImageData, ChartData } from './entities/section.entity';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PagesService } from '../pages/pages.service';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    private pagesService: PagesService,
  ) {}

  async create(createSectionDto: CreateSectionDto, userId: string): Promise<Section> {
    const { pageId, type, data } = createSectionDto;

    // Verify page exists and user owns it
    await this.pagesService.findOne(pageId, userId);

    // Validate section data based on type
    this.validateSectionData(type, data);

    // Get the next order number for this page
    const lastSection = await this.sectionModel
      .findOne({ pageId: new Types.ObjectId(pageId) })
      .sort({ order: -1 })
      .exec();

    const order = lastSection ? lastSection.order + 1 : 0;

    const section = new this.sectionModel({
      type,
      data,
      order,
      pageId: new Types.ObjectId(pageId),
    });

    const savedSection = await section.save();

    // Add section to page
    await this.pagesService.addSection(pageId, savedSection._id.toString(), userId);

    return savedSection;
  }

  async findByPage(pageId: string): Promise<Section[]> {
    return this.sectionModel
      .find({ pageId: new Types.ObjectId(pageId) })
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionModel.findById(id).exec();
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto, userId: string): Promise<Section> {
    const section = await this.findOne(id);

    // Verify user owns the page this section belongs to
    await this.pagesService.findOne(section.pageId.toString(), userId);

    // Validate section data if type or data is being updated
    if (updateSectionDto.type || updateSectionDto.data) {
      const type = updateSectionDto.type || section.type;
      const data = updateSectionDto.data || section.data;
      this.validateSectionData(type, data);
    }

    const updatedSection = await this.sectionModel
      .findByIdAndUpdate(id, updateSectionDto, { new: true })
      .exec();

    return updatedSection;
  }

  async remove(id: string, userId: string): Promise<void> {
    const section = await this.findOne(id);

    // Verify user owns the page this section belongs to
    await this.pagesService.findOne(section.pageId.toString(), userId);

    // Remove section from page
    await this.pagesService.removeSection(
      section.pageId.toString(),
      id,
      userId,
    );

    // Delete the section
    await this.sectionModel.findByIdAndDelete(id);

    // Reorder remaining sections
    await this.reorderSections(section.pageId.toString());
  }

  async reorderSections(pageId: string, sectionIds?: string[]): Promise<Section[]> {
    if (sectionIds) {
      // Update order based on provided array
      const updatePromises = sectionIds.map((sectionId, index) =>
        this.sectionModel.findByIdAndUpdate(sectionId, { order: index })
      );
      await Promise.all(updatePromises);
    } else {
      // Reorder existing sections to fill gaps
      const sections = await this.sectionModel
        .find({ pageId: new Types.ObjectId(pageId) })
        .sort({ order: 1 })
        .exec();

      const updatePromises = sections.map((section, index) =>
        this.sectionModel.findByIdAndUpdate(section._id, { order: index })
      );
      await Promise.all(updatePromises);
    }

    return this.findByPage(pageId);
  }

  private validateSectionData(type: SectionType, data: any): void {
    switch (type) {
      case SectionType.TEXT:
        this.validateTextData(data);
        break;
      case SectionType.IMAGE:
        this.validateImageData(data);
        break;
      case SectionType.CHART:
        this.validateChartData(data);
        break;
      default:
        throw new BadRequestException(`Invalid section type: ${type}`);
    }
  }

  private validateTextData(data: any): asserts data is TextData {
    if (!data.heading || typeof data.heading !== 'string') {
      throw new BadRequestException('Text section must have a heading');
    }
    if (!data.body || typeof data.body !== 'string') {
      throw new BadRequestException('Text section must have a body');
    }
  }

  private validateImageData(data: any): asserts data is ImageData {
    if (!data.url || typeof data.url !== 'string') {
      throw new BadRequestException('Image section must have a URL');
    }
    if (!data.caption || typeof data.caption !== 'string') {
      throw new BadRequestException('Image section must have a caption');
    }
  }

  private validateChartData(data: any): asserts data is ChartData {
    if (!Array.isArray(data.labels) || data.labels.length === 0) {
      throw new BadRequestException('Chart section must have labels array');
    }
    if (!Array.isArray(data.values) || data.values.length === 0) {
      throw new BadRequestException('Chart section must have values array');
    }
    if (data.labels.length !== data.values.length) {
      throw new BadRequestException('Chart labels and values arrays must have the same length');
    }
    if (!data.values.every((value: any) => typeof value === 'number')) {
      throw new BadRequestException('Chart values must be numbers');
    }
  }
}