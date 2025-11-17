import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from 'src/employee-profile/schemas/employee.schema';
import { Candidate } from './candidate.schema';

export enum DocumentType {
  ID = 'id',
  Contract = 'contract',
  Certification = 'certification',
  Form = 'form',
}

export enum DocumentStatus {
  Pending = 'pending',
  Uploaded = 'uploaded',
  Verified = 'verified',
}

export type OnboardingDocumentDocument = HydratedDocument<OnboardingDocument>;

@Schema({ timestamps: true })
export class OnboardingDocument {
  @Prop({ type: Types.ObjectId, ref: Candidate.name })
  candidateId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  employeeId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(DocumentType),
    required: true,
  })
  documentType: DocumentType;

  @Prop({ type: String, required: true })
  documentName: string;

  @Prop({ type: String, required: true })
  documentUrl: string;

  @Prop({
    type: String,
    enum: Object.values(DocumentStatus),
    required: true,
    default: DocumentStatus.Pending,
  })
  status: DocumentStatus;

  @Prop({ type: Date })
  verifiedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  verifiedBy: Types.ObjectId;
}

export const OnboardingDocumentSchema = SchemaFactory.createForClass(OnboardingDocument);

OnboardingDocumentSchema.pre('save', function(next) {
  const hasCandidate = !!this.candidateId;
  const hasEmployee = !!this.employeeId;
  
  if (!hasCandidate && !hasEmployee) {
    return next(new Error('Either candidateId or employeeId is required'));
  }
  
  if (hasCandidate && hasEmployee) {
    return next(new Error('Cannot have both candidateId and employeeId'));
  }
  
  next();
});