import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

export enum DepartmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Department {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  code: string; // HR, IT, FIN...

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  parentDepartmentId?: Types.ObjectId;

  @Prop({ enum: DepartmentStatus, default: DepartmentStatus.ACTIVE })
  status: DepartmentStatus;

  @Prop()
  effectiveFrom?: Date;

  @Prop()
  effectiveTo?: Date;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);