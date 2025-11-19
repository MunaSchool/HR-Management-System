import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from 'src/employee-profile/schemas/employee.schema';

export enum ChecklistItemType {
  ITAssets = 'it_assets',
  IDCard = 'id_card',
  Equipment = 'equipment',
  AccessRevocation = 'access_revocation',
  Handover = 'handover',
}

export enum ChecklistStatus {
  Pending = 'pending',
  Completed = 'completed',
}

export type OffboardingChecklistDocument = HydratedDocument<OffboardingChecklist>;

@Schema({ timestamps: true })
export class OffboardingChecklist {
  @Prop({ type: Types.ObjectId, ref: 'OffboardingCase', required: true })
  offboardingCaseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(ChecklistItemType),
    required: true,
  })
  itemType: ChecklistItemType;

  @Prop({ type: String, required: true })
  itemName: string;

  @Prop({ type: String })
  itemDescription: string;

  @Prop({
    type: String,
    enum: Object.values(ChecklistStatus),
    required: true,
    default: ChecklistStatus.Pending,
  })
  status: ChecklistStatus;

  @Prop({ type: Date })
  completedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  completedBy: Types.ObjectId;

  @Prop({ type: String })
  notes: string;
}

export const OffboardingChecklistSchema = SchemaFactory.createForClass(OffboardingChecklist);