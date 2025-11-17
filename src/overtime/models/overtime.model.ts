import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';



@Schema({ timestamps: true })
export class Overtime {
  @Prop({required: true, type: [mongoose.Schema.Types.ObjectId]})
       employeeId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  overtimeType: string;

  @Prop({ required: true })
  hourThresholds: number;

  @Prop({ required: true })
  approvalRequired: boolean;
}

export const OvertimeSchema = SchemaFactory.createForClass(Overtime);
export type OvertimeDocument = HydratedDocument<Overtime>
