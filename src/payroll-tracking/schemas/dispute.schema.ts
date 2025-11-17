import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Payslip', required: true })
  payslipId!: Types.ObjectId;

  @Prop({ required: true })
  reason!: string;

  @Prop({
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status!: string;

  @Prop()
  adminComments!: string;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
