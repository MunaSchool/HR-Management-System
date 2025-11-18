import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';

export enum OvertimeType {
  Normal = 'Normal',
  Weekend = 'Weekend',
  Holiday = 'Holiday',
}


@Schema({ timestamps: true })
export class Overtime {
  @Prop({required: true, type: [mongoose.Schema.Types.ObjectId], ref: 'Employee' })
       employeeId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  overtimeType: OvertimeType;

  @Prop({ required: true })
  hourThresholds: number;

  @Prop({ required: true })
  approvalRequired: boolean;
}

export const OvertimeSchema = SchemaFactory.createForClass(Overtime);
export type OvertimeDocument = HydratedDocument<Overtime>
