import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LeaveCategory } from './leave-category.schema';

export type LeaveTypeDocument = HydratedDocument<LeaveType>;

@Schema({ collection: 'leave_types', timestamps: true, versionKey: false })
export class LeaveType {
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: LeaveCategory.name, required: true })
  category: Types.ObjectId;

  @Prop({ default: false })
  needsDocument: boolean;

  @Prop({ default: true })
  deductedFromBalance: boolean;

  // Phase 3 — Payroll integration
  @Prop({ trim: true })
  payrollCode?: string;

  // Phase 3 — Limit enforcement per year
  @Prop({ min: 0 })
  maxPerYear?: number;
}

export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);
