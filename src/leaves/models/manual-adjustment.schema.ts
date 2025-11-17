import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ManualAdjustmentDocument = HydratedDocument<ManualAdjustment>;

@Schema({ collection: 'manual_adjustments', timestamps: true, versionKey: false })
export class ManualAdjustment {
  @Prop({ required: true, type: Types.ObjectId })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  changeDays: number; // + to add entitlement, - to deduct

  @Prop({ required: true, trim: true })
  reason: string;

  @Prop({ required: true, type: Types.ObjectId })
  modifiedBy: Types.ObjectId; // HR admin who did the change

  @Prop({ default: Date.now })
  modifiedAt: Date;
}

export const ManualAdjustmentSchema = SchemaFactory.createForClass(ManualAdjustment);
