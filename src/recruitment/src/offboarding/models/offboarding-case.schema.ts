import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from '../../employee.schema';

export enum OffboardingType {
  Resignation = 'resignation',
  Termination = 'termination',
}

export enum OffboardingStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum TerminationReason {
  Performance = 'performance',
  Misconduct = 'misconduct',
  Redundancy = 'redundancy',
  ContractEnd = 'contract_end',
  Other = 'other',
}

export type OffboardingCaseDocument = HydratedDocument<OffboardingCase>;

@Schema({ timestamps: true })
export class OffboardingCase {
  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(OffboardingType),
    required: true,
  })
  offboardingType: OffboardingType;

  @Prop({ type: Date, required: true })
  effectiveDate: Date;

  @Prop({ type: String, required: true })
  reason: string;

  @Prop({
    type: String,
    enum: Object.values(TerminationReason),
  })
  terminationReason: TerminationReason;

  @Prop({
    type: String,
    enum: Object.values(OffboardingStatus),
    required: true,
    default: OffboardingStatus.Pending,
  })
  status: OffboardingStatus;

  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  initiatedBy: Types.ObjectId;

  @Prop({ type: Date })
  lastWorkingDay: Date;

  @Prop({ type: String })
  notes: string;
}

export const OffboardingCaseSchema = SchemaFactory.createForClass(OffboardingCase);