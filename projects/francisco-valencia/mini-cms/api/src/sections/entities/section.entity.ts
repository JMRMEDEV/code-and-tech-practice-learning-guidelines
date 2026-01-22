import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SectionDocument = Section & Document;

export enum SectionType {
  TEXT = 'text',
  IMAGE = 'image',
  CHART = 'chart',
}

export interface TextData {
  heading: string;
  body: string;
}

export interface ImageData {
  url: string;
  caption: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export type SectionData = TextData | ImageData | ChartData;

@Schema({ timestamps: true })
export class Section {
  _id: Types.ObjectId;

  @Prop({ required: true, enum: SectionType })
  type: SectionType;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ type: Object, required: true })
  data: SectionData;

  @Prop({ type: Types.ObjectId, ref: 'Page', required: true })
  pageId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SectionSchema = SchemaFactory.createForClass(Section);

// Create index for page sections ordering
SectionSchema.index({ pageId: 1, order: 1 });