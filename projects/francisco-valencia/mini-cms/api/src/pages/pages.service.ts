import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Page, PageDocument } from './entities/page.entity';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
  ) {}

  async create(createPageDto: CreatePageDto, userId: string): Promise<Page> {
    try {
      const page = new this.pageModel({
        ...createPageDto,
        userId: new Types.ObjectId(userId),
      });
      return await page.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A page with this slug already exists');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<Page[]> {
    return this.pageModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('title slug createdAt updatedAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Page> {
    const page = await this.pageModel
      .findById(id)
      .populate('sections')
      .exec();

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this page');
    }

    return page;
  }

  async findBySlug(slug: string): Promise<Page> {
    const page = await this.pageModel
      .findOne({ slug })
      .populate('sections')
      .exec();

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto, userId: string): Promise<Page> {
    const page = await this.pageModel.findById(id);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this page');
    }

    try {
      const updatedPage = await this.pageModel
        .findByIdAndUpdate(id, updatePageDto, { new: true })
        .populate('sections')
        .exec();

      return updatedPage;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('A page with this slug already exists');
      }
      throw error;
    }
  }

  async remove(id: string, userId: string): Promise<void> {
    const page = await this.pageModel.findById(id);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this page');
    }

    await this.pageModel.findByIdAndDelete(id);
  }

  async addSection(pageId: string, sectionId: string, userId: string): Promise<Page> {
    const page = await this.pageModel.findById(pageId);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to modify this page');
    }

    page.sections.push(sectionId as any);
    return await page.save();
  }

  async removeSection(pageId: string, sectionId: string, userId: string): Promise<Page> {
    const page = await this.pageModel.findById(pageId);

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to modify this page');
    }

    page.sections = page.sections.filter(
      (section) => section.toString() !== sectionId
    );
    
    return await page.save();
  }
}