import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Section } from '../../sections/entities/section.entity';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }] })
  sections: Section[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);

// Create index for slug uniqueness
PageSchema.index({ slug: 1 }, { unique: true });

// Create index for user pages
PageSchema.index({ userId: 1 });