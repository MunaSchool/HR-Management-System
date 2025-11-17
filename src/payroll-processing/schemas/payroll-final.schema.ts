import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayrollFinalDocument = PayrollFinal & Document;

@Schema({ timestamps: true })
export class PayrollFinal {

  @Prop({ type: Types.ObjectId, ref: 'PayrollCycle', required: true })
  payrollCycleId: Types.ObjectId; 

  @Prop({ required: true })
  periodStart!: Date;

  @Prop({ required: true })
  periodEnd!: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Payslip' }], default: [] })
  payslips!: Types.ObjectId[];

  @Prop({ type: {
      totalGross: Number,
      totalNet: Number,
      totalTaxes: Number,
      totalInsurance: Number,
    },
    default: {},
  })
  summary!: {
    totalGross?: number;
    totalNet?: number;
    totalTaxes?: number;
    totalInsurance?: number;
  };

  @Prop({ type: [String], default: [] })
  anomalies!: string[];
}

export const PayrollFinalSchema = SchemaFactory.createForClass(PayrollFinal);
