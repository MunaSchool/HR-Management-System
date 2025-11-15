import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PositionDocument = HydratedDocument<Position>;

export enum PositionStatus {
  ACTIVE = 'ACTIVE',
  DELIMITED = 'DELIMITED', // closed but kept in history
}

@Schema({ timestamps: true })
export class Position {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string; // e.g. "HR-MANAGER"

  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  departmentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Position', default: null })
  reportsToPositionId?: Types.ObjectId;

  @Prop()
  payGradeCode?: string;

  @Prop({ default: false })
  isManagerial?: boolean;

  @Prop({ enum: PositionStatus, default: PositionStatus.ACTIVE })
  status: PositionStatus;

  @Prop()
  effectiveFrom?: Date;

  @Prop()
  effectiveTo?: Date;
}

export const PositionSchema = SchemaFactory.createForClass(Position);