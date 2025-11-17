import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Document, Types } from 'mongoose';

export type ApprovalHistoryDocument = ApprovalHistory & Document;

@Schema({ timestamps: true })
export class ApprovalHistory {
  @Prop({ type: Types.ObjectId, ref: 'PayrollCycle', required: true }) //it was refrenced as payrollRun
  payrollCycleId: Types.ObjectId; // Which payroll cycle this action belongs to

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true }) //it was refrenced as User
  performedBy: Types.ObjectId; // Specialist / Manager / Finance Staff
  
  ///////
  @Prop({ type: Types.ObjectId, ref: 'Bonus', required: false })
  bonusId?: Types.ObjectId;

  /////
    // For termination/resignation benefit approvals
  @Prop({ type: Types.ObjectId, ref: 'Compensation' })
  compensationId?: Types.ObjectId;

  // For payroll draft approvals
  @Prop({ type: Types.ObjectId, ref: 'PayrollDraft' })
  payrollDraftId?: Types.ObjectId;
//////

  @Prop({
    type: String,
    enum: [
      'SPECIALIST_REVIEW',/////
      'SPECIALIST_PUBLISH',
      'MANAGER_APPROVE',
      'MANAGER_REJECT',
      'FINANCE_APPROVE',
      'FINANCE_REJECT',
      'PAYROLL_LOCKED',
      'PAYROLL_UNLOCKED',
      'BONUS_APPROVED',/////
      'BONUS_REJECTED',/////
      'COMPENSATION_APPROVED',/////
      'COMPENSATION_REJECTED'/////
    ],
    required: true,
  })
  action: string; // What action was performed

  @Prop({ type: String })
  comment?: string; // Reason for approval/rejection/unlock

  @Prop({ type: String })
  previousStatus?: string; // Status before the action

  @Prop({ type: String })
  newStatus?: string; // Status after the action

  /////
    @Prop({
    type: String,
    enum: ['PAYROLL', 'BONUS', 'COMPENSATION', 'DRAFT'],
    default: 'PAYROLL',
  })
  category!: string;
  //////
}

export const ApprovalHistorySchema = SchemaFactory.createForClass(ApprovalHistory);
