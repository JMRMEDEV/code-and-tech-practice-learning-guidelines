import { Document, Types } from 'mongoose';
import { Section } from '../../sections/entities/section.entity';

export interface IPage extends Document {
  title: string;
  slug: string;
  sections: Section[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}