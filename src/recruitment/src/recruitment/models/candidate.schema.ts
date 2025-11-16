import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema({ timestamps: true }) 

export class Candidate {

 
  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    required: true,
  })
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: String;
  };

  @Prop({
    type: {
      cvUrl: { type: String, required: true },
      coverLetterUrl: { type: String, required: false },
    },
    required: true,
  })
  documents: {
    cvUrl: string;
    coverLetterUrl?: string;
  };

  @Prop({
    type: {
      dataProcessingConsent: { type: Boolean, required: true },
      consentDate: { type: Date, required: true },
    },
    required: true,
  })
  consent: {
    dataProcessingConsent: boolean;
    consentDate: Date;
  };

  @Prop({
    type: {
      applicationSource: { type: String, required: true }, // e.g, LinkedIn, Website
      isReferral: { type: Boolean, required: true, default: false },
      referredBy: { type: String, required: false }
    },
    required: true,
  })
  source: {
    applicationSource: string;
    isReferral: boolean;
    referredBy?: string;
  };

  // createdAt & updatedAt are automatically added by `timestamps: true`
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
