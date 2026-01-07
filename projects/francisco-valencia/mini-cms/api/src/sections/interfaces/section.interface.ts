import { Document, Types } from 'mongoose';
import { SectionType, SectionData } from '../entities/section.entity';

export interface ISection extends Document {
  type: SectionType;
  order: number;
  data: SectionData;
  pageId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}