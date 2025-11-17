import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AppraisalType } from '../enum/appraisal-type.enum';
import { AppraisalStatus } from '../enum/appraisal-status.enum';

export type AppraisalCycleDocument = HydratedDocument<AppraisalCycle>;

@Schema({ timestamps: true })
export class AppraisalCycle {
  @Prop({ required: true })
  name: string; // e.g. "2025 Annual Appraisal"

  @Prop({
    type: String,
    enum: AppraisalType,
    required: true,
  })
  type: AppraisalType;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PerformanceTemplate',   // FIXED HERE!!
    required: true,
  })
  template: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: AppraisalStatus,
    default: AppraisalStatus.DRAFT,
  })
  status: AppraisalStatus;

  @Prop({ type: [String], default: [] })
  includedOrgUnits?: string[]; // department IDs
}

export const AppraisalCycleSchema =
  SchemaFactory.createForClass(AppraisalCycle);
