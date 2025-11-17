import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayslipDocument = Payslip & Document;

@Schema({ timestamps: true })
export class Payslip {

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employee!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'PayrollFinal', required: true })
  payrollFinal!: Types.ObjectId;
////
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bonus' }], default: [] })
  bonuses!: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Compensation' }], default: [] })
  compensations!: Types.ObjectId[];
/////
  @Prop({ required: true })
  grossSalary!: number;

  @Prop({ required: true })
  taxAmount!: number;

  @Prop({ required: true })
  insuranceAmount!: number;

  @Prop({ required: true })
  penalties!: number;

  @Prop({ required: true })
  netSalary!: number;

  @Prop({ type: Object, default: {} })
  breakdown!: Record<string, number>;

  @Prop({ default: false })
  needsReview!: boolean;  

}
export const PayslipSchema = SchemaFactory.createForClass(Payslip);
