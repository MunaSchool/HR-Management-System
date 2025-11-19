import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';


export enum FalsePenaltyType {
  Holiday = 'Holiday',
  Leave = 'Leave',
}


@Schema({ timestamps: true })
export class FalsePenalty {

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee'})
         employeeId: mongoose.Schema.Types.ObjectId;
  
  @Prop({ required: true, enum: FalsePenaltyType })
  type: FalsePenaltyType;
 
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee'})
  approvedBy: mongoose.Schema.Types.ObjectId;
}

export const FalsePenaltySchema = SchemaFactory.createForClass(FalsePenalty);
export type FalsePenaltyDocument= HydratedDocument<FalsePenalty>
