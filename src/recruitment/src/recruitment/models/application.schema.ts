import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum ApplicationStatus {
  Submitted = 'submitted',
  Screening = 'screening',
  Shortlisted = 'shortlisted',
  InterviewScheduled = 'interview_scheduled',
  Interviewed = 'interviewed',
  OfferSent = 'offer_sent',
  OfferAccepted = 'offer_accepted',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn',
}

export enum CommunicationType {
  Email = 'email',
  SMS = 'sms',
  PhoneCall = 'phone_call',
}

export enum CommunicationStatus {
  Sent = 'sent',
  Delivered = 'delivered',
  Failed = 'failed',
  Pending = 'pending',
}

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true }) 
export class Application {

  @Prop({ type: Types.ObjectId, ref: 'Candidate', required: true })
  candidateId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'JobPosting', required: true })
  jobPostingId: Types.ObjectId;

  @Prop({ 
    type: String, 
    enum: Object.values(ApplicationStatus), 
    required: true, 
    default: ApplicationStatus.Submitted 
  })
  status: ApplicationStatus;

  @Prop({ 
    type: String, 
    enum: Object.values(ApplicationStatus), 
    required: true, 
    default: ApplicationStatus.Submitted 
  })
  currentStage: ApplicationStatus;

  @Prop({ type: Number, default: 0 })
  progressPercentage: number;

  @Prop({
    type: [
      {
        stage: { type: String, enum: Object.values(ApplicationStatus), required: true },
        date: { type: Date, required: true },
        notes: { type: String },
      },
    ],
    default: [],
  })
  stageHistory: {
    stage: ApplicationStatus;
    date: Date;
    notes?: string;
  }[];

  @Prop({ type: Number })
  screeningScore?: number;

  @Prop({ type: String })
  screeningNotes?: string;

  @Prop({ type: Date })
  screeningDate?: Date;

  @Prop({ type: Number })
  totalScore?: number;

  @Prop({ type: String })
  evaluationComments?: string;

  @Prop({
    type: {
      offeredSalary: { type: Number },
      offerDate: { type: Date },
      accepted: { type: Boolean, default: false },
      notes: { type: String },
    },
  })
  offerDetails?: {
    offeredSalary?: number;
    offerDate?: Date;
    accepted?: boolean;
    notes?: string;
  };

  // Communication logs
  @Prop({
    type: [
      {
        type: { 
          type: String, 
          enum: Object.values(CommunicationType), 
          required: true 
        },
        subject: { type: String },
        message: { type: String, required: true },
        templateUsed: { type: String },
        status: { 
          type: String, 
          enum: Object.values(CommunicationStatus), 
          required: true,
          default: CommunicationStatus.Pending 
        },
        sentBy: { type: String, required: true },
        sentAt: { type: Date, required: true, default: Date.now },
        deliveredAt: { type: Date },
        failureReason: { type: String },
        metadata: { type: Object },
      },
    ],
    default: [],
  })
  communicationLogs: {
    type: CommunicationType;
    subject?: string;
    message: string;
    templateUsed?: string;
    status: CommunicationStatus;
    sentBy: string;
    sentAt: Date;
    deliveredAt?: Date;
    failureReason?: string;
    metadata?: Record<string, any>;
  }[];

  @Prop({ type: Date })
  appliedAt: Date;

  @Prop({ type: Date })
  lastStatusUpdate: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// NO HELPER METHODS - Keep it simple!