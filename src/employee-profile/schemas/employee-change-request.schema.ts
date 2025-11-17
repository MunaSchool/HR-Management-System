import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EmployeeChangeableField } from '../enums/changeable-fields.enum';
hello i am ahmed

export type EmployeeChangeRequestDocument =
  HydratedDocument<EmployeeChangeRequest>;

export enum ChangeRequestStatus {
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class EmployeeChangeRequest {
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
  requestedBy: mongoose.Types.ObjectId;

  @Prop({
    type: String,
    enum: ChangeRequestStatus,
    default: ChangeRequestStatus.SUBMITTED,
  })
  status: ChangeRequestStatus;

  @Prop({
    type: [String],
    enum: EmployeeChangeableField,
    required: true,
  })
  fields: EmployeeChangeableField[]; // e.g. ['department', 'jobTitle']

  @Prop({ type: Object })
  oldValues?: Record<string, any>;

  @Prop({ type: Object, required: true })
  newValues: Record<string, any>;

  @Prop()
  reason?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' })
  approvedBy?: mongoose.Types.ObjectId;

  @Prop({ type: Date })
  approvedAt?: Date;

  @Prop()
  rejectionReason?: string;
}

export const EmployeeChangeRequestSchema =
  SchemaFactory.createForClass(EmployeeChangeRequest);
