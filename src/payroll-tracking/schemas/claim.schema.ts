import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employeeId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ type: [String], default: [] })
  attachments!: string[];

  @Prop({
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status!: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
