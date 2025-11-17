import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RefundDocument = Refund & Document;

@Schema({ timestamps: true })
export class Refund {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Claim' })
  claimId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Dispute' })
  disputeId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  processedBy!: Types.ObjectId;

  @Prop({ type: Date })
  processedAt!: Date;
}

export const RefundSchema = SchemaFactory.createForClass(Refund);
