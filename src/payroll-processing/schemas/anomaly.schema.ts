import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Document, Types } from 'mongoose';

export type AnomalyDocument = Anomaly & Document;

@Schema({ timestamps: true })
export class Anomaly {
  @Prop({ type: Types.ObjectId, ref: 'PayrollCycle', required: true })// it was refernced as payrollRun
  payrollCycleId: Types.ObjectId; // Links anomaly to a specific payroll cycle

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId: Types.ObjectId; // Employee who triggered the anomaly

  @Prop({
    type: String,
    enum: [
      'MISSING_BANK_ACCOUNT',
      'NEGATIVE_NET_PAY',
      'NO_PAY_GRADE',
      'EXCESSIVE_PENALTIES',
      'ZERO_SALARY',
      'PAYMENT_FAILURE',
      'MISSING_HR_EVENT',
    ],
    required: true,
  })
  type: string; // The anomaly type (categorized)

  @Prop({ type: String, required: true })
  message: string; // Human-readable explanation (ex: "Employee has no bank account")

  @Prop({ type: Boolean, default: false })
  resolved: boolean; // When Payroll Specialist fixes it → mark resolved

  @Prop({ type: String })
  resolutionComment?: string; // Explanation of how it was resolved

  @Prop({ type: Types.ObjectId, ref: 'Employee' }) // it was refrenced as User
  resolvedBy?: Types.ObjectId; // Who resolved it (manager or specialist)
}

export const AnomalySchema = SchemaFactory.createForClass(Anomaly);
