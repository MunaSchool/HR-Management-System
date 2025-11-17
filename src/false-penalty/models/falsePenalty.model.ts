import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';




@Schema({ timestamps: true })
export class FalsePenalty {

  @Prop({required: true, type: [mongoose.Schema.Types.ObjectId]})
         employeeId: mongoose.Schema.Types.ObjectId;
  
  @Prop({
    required: true,
    enum: ['Holiday', 'Leave'], 
  })
  type: string;
 
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  approvedBy: string;
}

export const FalsePenaltySchema = SchemaFactory.createForClass(FalsePenalty);
export type FalsePenaltyDocument= HydratedDocument<FalsePenalty>
