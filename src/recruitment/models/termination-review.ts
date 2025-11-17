import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from 'src/employee-profile/schemas/employee.schema';

export enum TerminationReason {
  Performance = 'performance',
  Misconduct = 'misconduct',
  Redundancy = 'redundancy',
  ContractEnd = 'contract_end',
  Other = 'other',
}

export enum ReviewStatus {
  Pending = 'pending',
  UnderReview = 'under_review',
  Approved = 'approved',
  Rejected = 'rejected',
}

export type TerminationReviewDocument = HydratedDocument<TerminationReview>;

@Schema({ timestamps: true })
export class TerminationReview {
  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(TerminationReason),
    required: true,
  })
  terminationReason: TerminationReason;

  @Prop({ type: String, required: true })
  justification: string;

  @Prop({ type: [String], default: [] })
  supportingDocuments: string[];

  @Prop({
    type: String,
    enum: Object.values(ReviewStatus),
    required: true,
    default: ReviewStatus.Pending,
  })
  status: ReviewStatus;

  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  initiatedBy: Types.ObjectId;

  @Prop({ type: Date })
  reviewedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  reviewedBy: Types.ObjectId;

  @Prop({ type: String })
  reviewNotes: string;

  @Prop({ type: Date })
  proposedTerminationDate: Date;
}

export const TerminationReviewSchema = SchemaFactory.createForClass(TerminationReview);