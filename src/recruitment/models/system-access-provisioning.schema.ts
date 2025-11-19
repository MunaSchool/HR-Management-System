import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Employee } from 'src/employee-profile/schemas/employee.schema';

export enum SystemAccessType {
  Email = 'email',
  Payroll = 'payroll',
  InternalSystem = 'internal_system',
  SSO = 'sso',
  Software = 'software',
}

export enum ProvisioningStatus {
  Pending = 'pending',
  Provisioned = 'provisioned',
  Revoked = 'revoked',
}

export type SystemAccessProvisioningDocument = HydratedDocument<SystemAccessProvisioning>;

@Schema({ timestamps: true })
export class SystemAccessProvisioning {
  @Prop({ type: Types.ObjectId, ref: Employee.name, required: true })
  employeeId: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(SystemAccessType),
    required: true,
  })
  accessType: SystemAccessType;

  @Prop({ type: String, required: true })
  systemName: string;

  @Prop({ type: String })
  username: string;

  @Prop({
    type: String,
    enum: Object.values(ProvisioningStatus),
    required: true,
    default: ProvisioningStatus.Pending,
  })
  status: ProvisioningStatus;

  @Prop({ type: Date })
  provisionedAt: Date;

  @Prop({ type: Date })
  scheduledRevocationDate: Date;

  @Prop({ type: Date })
  revokedAt: Date;

  @Prop({ type: Types.ObjectId, ref: Employee.name })
  provisionedBy: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isAutoProvisioned: boolean;
}

export const SystemAccessProvisioningSchema = SchemaFactory.createForClass(SystemAccessProvisioning);