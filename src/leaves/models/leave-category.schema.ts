import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeaveCategoryDocument = HydratedDocument<LeaveCategory>;

@Schema({ collection: 'leave_categories', timestamps: true, versionKey: false })
export class LeaveCategory {
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  // Phase 3 — indicates if leave under this category is paid or unpaid
  @Prop({ default: true })
  isPaid: boolean;
}

export const LeaveCategorySchema = SchemaFactory.createForClass(LeaveCategory);
