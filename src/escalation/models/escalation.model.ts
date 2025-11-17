import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';


export enum EscalationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

@Schema({ timestamps: true })
export class Escalation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
      requestedBy: mongoose.Schema.Types.ObjectId; 
  
 @Prop({ type: mongoose.Schema.Types.ObjectId })
     approvedBy?: mongoose.Schema.Types.ObjectId; 
 

  @Prop({  type: mongoose.Schema.Types.ObjectId  })
  escalatedTo: mongoose.Schema.Types.ObjectId; 
 

   @Prop({ enum: EscalationStatus, default: EscalationStatus.Pending })
      status: EscalationStatus;

  @Prop({ required: true })
  escalationDate: Date;
}

export const EscalationSchema = SchemaFactory.createForClass(Escalation);
export type EscalationDocument= HydratedDocument<Escalation>
