import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type InterviewDocument = HydratedDocument<Interview>;

@Schema({ timestamps: true })
export class Interview {
  // References
  @Prop({
    type: Object,
    required: true,
  })
  references: {
    applicationId: Types.ObjectId;
    candidateId: Types.ObjectId;
    jobPostingId: Types.ObjectId;
  };

  // Scheduling
  @Prop({
    type: Object,
    required: true,
  })
  scheduling: {
    interviewDate: Date;
    interviewTime: string;
    duration: number;
    mode: 'in_person' | 'virtual' | 'phone';
  };

  // Panel members
  @Prop({
    type: [
      {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        role: { type: String, required: true },
        availability: { type: String },
      },
    ],
    default: [],
  })
  panelMembers: {
    userId: Types.ObjectId;
    role: string;
    availability?: string;
  }[];

  // Interviewer feedback / scores
  @Prop({
    type: [
      {
        interviewerId: { type: Types.ObjectId, ref: 'User', required: true },
        criteriaScores: {
          type: [
            {
              criterion: { type: String, required: true },
              score: { type: Number, required: true },
              maxScore: { type: Number, required: true },
              weight: { type: Number, required: true },
            },
          ],
          default: [],
        },
        overallRating: { type: Number },
        comments: { type: String },
        recommendation: {
          type: String,
          enum: ['strong_hire', 'hire', 'no_hire'],
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  interviewerScores: {
    interviewerId: Types.ObjectId;
    criteriaScores: {
      criterion: string;
      score: number;
      maxScore: number;
      weight: number;
    }[];
    overallRating?: number;
    comments?: string;
    recommendation?: 'strong_hire' | 'hire' | 'no_hire';
    submittedAt: Date;
  }[];

  // Status
  @Prop({
    type: String,
    required: true,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
  })
  status: string;

  // Meeting link for virtual interviews
  @Prop()
  meetingLink?: string;

  @Prop()
criteria?: string ;
}



export const InterviewSchema = SchemaFactory.createForClass(Interview);
