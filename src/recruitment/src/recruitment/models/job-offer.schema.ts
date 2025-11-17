import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type JobOfferDocument = HydratedDocument<JobOffer>;

@Schema({ timestamps: true })
export class JobOffer {
  // References
  @Prop({ type: Types.ObjectId, ref: 'Application', required: true })
  applicationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'JobPosting', required: true })
  jobPostingId: Types.ObjectId;

  // Offer details
  @Prop({ required: true })
  position: string;

  @Prop()
  department?: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: [String], default: [] })
  benefits: string[];

  // Status
  @Prop({
    type: String,
    required: true,
    enum: ['draft', 'pending_approval', 'sent', 'accepted', 'rejected', 'withdrawn'],
  })
  status: string;

  // Approval chain
  @Prop({
    type: [
      {
        approver: { type: Types.ObjectId, ref: 'User', required: true },
        role: { type: String, required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      },
    ],
    default: [],
  })
  approvalChain: {
    approver: Types.ObjectId;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];

  // Documents
  @Prop()
  offerLetterUrl?: string;

  @Prop()
  signedOfferUrl?: string;

  // Dates
  @Prop()
  sentDate?: Date;

  @Prop()
  acceptanceDate?: Date;

  @Prop()
  expiryDate?: Date;
}

export const JobOfferSchema = SchemaFactory.createForClass(JobOffer);
