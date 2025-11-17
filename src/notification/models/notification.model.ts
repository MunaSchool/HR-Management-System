import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


export enum NotificationType {
  ShiftExpiry = 'ShiftExpiry',
  MissedPunch = 'MissedPunch',
  ApprovalPending = 'ApprovalPending',
  Escalation = 'Escalation',
  Other = 'Other',
}

@Schema()
export class Notification {
  @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
  recipientId: mongoose.Schema.Types.ObjectId;

  @Prop({required: true, default: "Untitled"})
  title: string;

  @Prop({ required: true })
  message: string; 

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType; 

  @Prop({ default: Date.now })
  timestamp: Date; 

  @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
  senderId: mongoose.Schema.Types.ObjectId
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = HydratedDocument<Notification>
