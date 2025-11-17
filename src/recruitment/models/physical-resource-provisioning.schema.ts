import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from 'src/employee-profile/schemas/employee.schema';

export enum PhysicalResourceType {
  Laptop = 'laptop',
  Desktop = 'desktop',
  Monitor = 'monitor',
  Desk = 'desk',
  AccessCard = 'access_card',
  Equipment = 'equipment',
}

export enum ProvisioningStatus {
  Pending = 'pending',
  Provisioned = 'provisioned',
  Revoked = 'revoked',
}

export type PhysicalResourceProvisioningDocument = HydratedDocument<PhysicalResourceProvisioning>;

@Schema({ timestamps: true })
export class PhysicalResourceProvisioning {
  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(PhysicalResourceType),
    required: true,
  })
  resourceType: PhysicalResourceType;

  @Prop({ type: String, required: true })
  resourceName: string;

  @Prop({ type: String })
  serialNumber: string;

  @Prop({ type: String })
  location: string;

  @Prop({
    type: String,
    enum: Object.values(ProvisioningStatus),
    required: true,
    default: ProvisioningStatus.Pending,
  })
  status: ProvisioningStatus;

  @Prop({ type: Date })
  provisionedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  provisionedBy: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isAutoProvisioned: boolean;
}

export const PhysicalResourceProvisioningSchema = SchemaFactory.createForClass(PhysicalResourceProvisioning);