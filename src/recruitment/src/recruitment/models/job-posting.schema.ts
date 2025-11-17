import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobPostingDocument = JobPosting & Document;

export enum JobPostingStatus {
  //DRAFT = 'draft',
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Schema({ timestamps: true })
export class JobPosting {

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1 })
  numberOfOpenings: number;

  @Prop({ type: [String], required: true })
  qualifications: string[];

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ type: [String], required: true })
  responsibilities: string[];

  @Prop({ 
    type: String, 
    enum: JobPostingStatus
  })
  status: JobPostingStatus;

  @Prop()
  publishedAt?: Date;

  @Prop()
  closedAt?: Date;

  @Prop({ required: true })
  createdBy: string; 

  @Prop({ required: true })
  departmentId: string;

  @Prop({ required: true })
  positionId: string

  createdAt?: Date;
  updatedAt?: Date;
}

export const JobPostingSchema = SchemaFactory.createForClass(JobPosting);

JobPostingSchema.index({ status: 1 });
JobPostingSchema.index({ department: 1 });
JobPostingSchema.index({ createdBy: 1 });
JobPostingSchema.index({ createdAt: -1 });