import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DisputeStatus } from '../enum/dispute-status.enum';
import { AppraisalStatus } from '../enum/appraisal-status.enum';

export type AppraisalDocument = HydratedDocument<Appraisal>;

@Schema()
export class CriteriaRating {
  @Prop({ required: true })
  criteriaName: string;

  @Prop({ required: true })
  score: number; // e.g. 1–5

  @Prop()
  comment?: string;
}

@Schema({ timestamps: true })
export class Appraisal {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  employee: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  manager: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppraisalCycle',
    required: true,
  })
  cycle: mongoose.Types.ObjectId;

  @Prop({ type: [CriteriaRating], default: [] })
  criteriaRatings: CriteriaRating[];

  @Prop()
  overallComment?: string;

  @Prop()
  overallScore?: number; // weighted score

  @Prop({
    type: String,
    enum: AppraisalStatus,
    default: AppraisalStatus.DRAFT,
  })
  status: AppraisalStatus; // drive lifecycle inside the cycle

  @Prop({ default: false })
  published: boolean; // when HR publishes to employee

  // ===== Dispute flow =====
  @Prop({
    type: String,
    enum: DisputeStatus,
    default: DisputeStatus.NONE,
  })
  disputeStatus: DisputeStatus;

  @Prop()
  disputeReason?: string;

  @Prop()
  disputeResolutionComment?: string;

  @Prop({ type: Date })
  disputeSubmittedAt?: Date;

  @Prop({ type: Date })
  disputeResolvedAt?: Date;
}

export const CriteriaRatingSchema =
  SchemaFactory.createForClass(CriteriaRating);

export const AppraisalSchema = SchemaFactory.createForClass(Appraisal);