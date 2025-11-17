import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeaveRequestDocument = HydratedDocument<LeaveRequest>;

export enum LeaveRequestStatus {
  PENDING_MANAGER = 'PENDING_MANAGER',
  MANAGER_APPROVED = 'MANAGER_APPROVED',
  MANAGER_REJECTED = 'MANAGER_REJECTED',
  PENDING_HR = 'PENDING_HR',
  HR_APPROVED = 'HR_APPROVED',
  HR_REJECTED = 'HR_REJECTED',
  CANCELLED = 'CANCELLED', // Phase 3
}

@Schema({ collection: 'leave_requests', timestamps: true, versionKey: false })
export class LeaveRequest {
  @Prop({ required: true })
  employeeId: string; // keep as string unless Employee model exists

  @Prop({ type: Types.ObjectId, ref: 'LeaveType', required: true })
  leaveTypeId: Types.ObjectId; // FIXED: now properly references LeaveType

  @Prop({ required: true })
  dateFrom: Date;

  @Prop({ required: true })
  dateTo: Date;

  @Prop()
  justification?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];

  @Prop({ default: false })
  isPostLeaveRequest: boolean;

  @Prop({
    type: String,
    enum: Object.values(LeaveRequestStatus),
    default: LeaveRequestStatus.PENDING_MANAGER,
  })
  status: LeaveRequestStatus;

  // Manager-level data
  @Prop() managerId?: string;
  @Prop() managerDecisionAt?: Date;
  @Prop() managerDecisionNote?: string;

  // HR-level data
  @Prop() hrAdminId?: string;
  @Prop() hrDecisionAt?: Date;
  @Prop() hrDecisionNote?: string;

  // --- Phase 3 Fields ---
  @Prop({ min: 0 })
  totalDays?: number; // stored for audits and settlements

  @Prop({ default: false })
  documentsValidated: boolean;

  @Prop({ default: false })
  isConvertedToUnpaid: boolean; // BR-29: if exceeded entitlement

  @Prop()
  overlapRequestId?: string; // optional cross-reference
}

export const LeaveRequestSchema = SchemaFactory.createForClass(LeaveRequest);
