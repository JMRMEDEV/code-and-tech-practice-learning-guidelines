import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PagesService } from '../pages/pages.service';
import { SectionsService } from '../sections/sections.service';
import { FileSystemService } from './services/filesystem.service';
import { PublishedPage, PublishedSection } from './interfaces/published-page.interface';

@Injectable()
export class PublishService {
  private readonly logger = new Logger(PublishService.name);

  constructor(
    private readonly pagesService: PagesService,
    private readonly sectionsService: SectionsService,
    private readonly fileSystemService: FileSystemService,
  ) {}

  async publishPage(pageId: string, userId: string): Promise<PublishedPage> {
    // Get the page with all its sections
    const page = await this.pagesService.findOne(pageId, userId);
    const sections = await this.sectionsService.findByPage(pageId);

    // Transform sections to published format
    const publishedSections: PublishedSection[] = sections.map(section => ({
      id: section._id.toString(),
      type: section.type,
      order: section.order,
      data: section.data,
    }));

    // Create published page object
    const publishedPage: PublishedPage = {
      title: page.title,
      slug: page.slug,
      sections: publishedSections,
      publishedAt: new Date(),
    };

    // Save to file system
    await this.fileSystemService.writeJsonFile(page.slug, publishedPage);

    this.logger.log(`Published page: ${page.slug}`);
    return publishedPage;
  }

  async getPublishedPage(slug: string): Promise<PublishedPage> {
    try {
      const publishedPage = await this.fileSystemService.readJsonFile(slug);
      return publishedPage;
    } catch (error) {
      throw new NotFoundException(`Published page with slug '${slug}' not found`);
    }
  }

  async unpublishPage(pageId: string, userId: string): Promise<void> {
    // Get the page to find its slug
    const page = await this.pagesService.findOne(pageId, userId);
    
    // Delete the published file
    await this.fileSystemService.deleteJsonFile(page.slug);
    
    this.logger.log(`Unpublished page: ${page.slug}`);
  }

  async republishPage(pageId: string, userId: string): Promise<PublishedPage> {
    // Simply publish again - this will overwrite the existing file
    return this.publishPage(pageId, userId);
  }

  async isPagePublished(slug: string): Promise<boolean> {
    return this.fileSystemService.fileExists(slug);
  }

  async listPublishedPages(): Promise<string[]> {
    return this.fileSystemService.listPublishedFiles();
  }

  async cleanupPublishedPage(slug: string): Promise<void> {
    await this.fileSystemService.deleteJsonFile(slug);
    this.logger.log(`Cleaned up published page: ${slug}`);
  }
}