import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type JobPositionDocument = HydratedDocument<JobPosition>;

@Schema({ timestamps: true })
export class JobPosition {
  @Prop({ required: true, unique: true })
  code: string; // "SE-1", "HR-GEN-2"

  @Prop({ required: true })
  title: string; // "Software Engineer"

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true })
  department: mongoose.Types.ObjectId;

  @Prop()
  payGrade?: string; // optional

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition' })
  reportsToPosition?: mongoose.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  validFrom?: Date;

  @Prop({ type: Date })
  validTo?: Date; // when position is delimited
}

export const JobPositionSchema = SchemaFactory.createForClass(JobPosition);