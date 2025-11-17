import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PayrollPolicyDocument = PayrollPolicy & Document;

@Schema({ timestamps: true })
export class PayrollPolicy {

  @Prop({ required: true })
  policyName: string;

  @Prop({
    required: true,
    enum: ['Misconduct', 'Leave', 'Allowance']
  })
  policyType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop({ required: false })
  lawReference?: string;

  // Rule Definition fields from UI
  @Prop({ required: false, default: 0 })
  percentage: number;

  @Prop({ required: false, default: 0 })
  fixedAmount: number;

  @Prop({ required: false })
  threshold: number;

  // Applicability (array of employee types)
  @Prop({
    type: [String],
    default: [],
    enum: ['All Employees', 'Full-time', 'Part-time', 'Temporary']
  })
  applicability: string[];

  @Prop({
    enum: ['Draft', 'Active', 'Pending Approval'],
    default: 'Draft',
  })
  status: string;

  @Prop({
    type: {
      createdBy: { type: String, required: true },
      updatedBy: { type: String },
    },
    required: true,
  })
  auditDetails: {
    createdBy: string;
    updatedBy?: string;
  };
}
export const PayrollPolicySchema = SchemaFactory.createForClass(PayrollPolicy);