import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayrollReportDocument = PayrollReport & Document;

@Schema({ timestamps: true })
export class PayrollReport {
  @Prop({
    enum: ['Monthly', 'Tax', 'Insurance', 'Department'],
    required: true,
  })
  type!: string;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  generatedBy!: Types.ObjectId;

  @Prop({ type: Object })
  data!: any;

  @Prop({ type: Date })
  generatedAt!: Date;
}

export const PayrollReportSchema = SchemaFactory.createForClass(PayrollReport);
