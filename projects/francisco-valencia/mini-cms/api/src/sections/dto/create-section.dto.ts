import { IsString, IsNotEmpty, IsEnum, IsObject, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SectionType } from '../entities/section.entity';

class TextDataDto {
  @ApiProperty({ example: 'Welcome to our site' })
  @IsString()
  @IsNotEmpty()
  heading: string;

  @ApiProperty({ example: 'This is the main content of the text section.' })
  @IsString()
  @IsNotEmpty()
  body: string;
}

class ImageDataDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'A beautiful landscape' })
  @IsString()
  @IsNotEmpty()
  caption: string;
}

class ChartDataDto {
  @ApiProperty({ example: ['Jan', 'Feb', 'Mar', 'Apr'] })
  @IsArray()
  @IsString({ each: true })
  labels: string[];

  @ApiProperty({ example: [10, 20, 30, 40] })
  @IsArray()
  @IsNumber({}, { each: true })
  values: number[];
}

export class CreateSectionDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsString()
  @IsNotEmpty({ message: 'Page ID is required' })
  pageId: string;

  @ApiProperty({ 
    enum: SectionType,
    example: SectionType.TEXT,
    description: 'Type of section: text, image, or chart'
  })
  @IsEnum(SectionType, { message: 'Type must be one of: text, image, chart' })
  type: SectionType;

  @ApiProperty({
    description: 'Section data - structure depends on type',
    oneOf: [
      { $ref: '#/components/schemas/TextDataDto' },
      { $ref: '#/components/schemas/ImageDataDto' },
      { $ref: '#/components/schemas/ChartDataDto' },
    ],
    example: { heading: 'Welcome', body: 'Content here' }
  })
  @IsObject()
  @IsNotEmpty({ message: 'Section data is required' })
  data: TextDataDto | ImageDataDto | ChartDataDto;
}