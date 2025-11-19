import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true, unique: true })
  code: string; // "IT", "HR", "FIN"

  @Prop({ required: true })
  name: string; // "Information Technology"

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department' })
  parentDepartment?: mongoose.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  // delimiting (history)
  @Prop({ type: Date })
  validFrom?: Date;

  @Prop({ type: Date })
  validTo?: Date; // when closed/merged
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);