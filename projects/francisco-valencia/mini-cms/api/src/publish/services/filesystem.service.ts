import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileSystemService {
  private readonly logger = new Logger(FileSystemService.name);
  private readonly publishedDir = join(process.cwd(), 'published');

  async ensurePublishedDirectory(): Promise<void> {
    try {
      await fs.access(this.publishedDir);
    } catch {
      await fs.mkdir(this.publishedDir, { recursive: true });
      this.logger.log('Created published directory');
    }
  }

  async writeJsonFile(filename: string, data: any): Promise<void> {
    await this.ensurePublishedDirectory();
    const filePath = join(this.publishedDir, `${filename}.json`);
    
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf8');
      this.logger.log(`Published file: ${filename}.json`);
    } catch (error) {
      this.logger.error(`Failed to write file ${filename}.json:`, error);
      throw error;
    }
  }

  async readJsonFile(filename: string): Promise<any> {
    const filePath = join(this.publishedDir, `${filename}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to read file ${filename}.json:`, error);
      throw error;
    }
  }

  async deleteJsonFile(filename: string): Promise<void> {
    const filePath = join(this.publishedDir, `${filename}.json`);
    
    try {
      await fs.unlink(filePath);
      this.logger.log(`Deleted published file: ${filename}.json`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Failed to delete file ${filename}.json:`, error);
        throw error;
      }
      // File doesn't exist, which is fine
    }
  }

  async fileExists(filename: string): Promise<boolean> {
    const filePath = join(this.publishedDir, `${filename}.json`);
    
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async listPublishedFiles(): Promise<string[]> {
    try {
      await this.ensurePublishedDirectory();
      const files = await fs.readdir(this.publishedDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      this.logger.error('Failed to list published files:', error);
      return [];
    }
  }
}