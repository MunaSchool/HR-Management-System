// src/employee/schemas/employee.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../enums/role.enum';
import { EmploymentStatus } from '../enums/employment-status.enum';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema()
export class Employee {
  // ========= AUTH / ACCOUNT =========
  @Prop({ required: true, unique: true })
  workEmail: string; // main company email (can also be used for login)

  @Prop({
    required: true,
    enum: Role,
    default: Role.EMPLOYEE,
  })
  role: Role;

  @Prop({ required: true })
  password: string; // store hashed password

  // ========= PERSONAL INFO (governed) =========
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  middleName?: string;

  @Prop()
  nationalId?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop()
  gender?: string; 

  // ========= CONTACT INFO (self-service) =========
  @Prop()
  personalEmail?: string;

  @Prop()
  mobilePhone?: string;

  @Prop()
  address?: string;

  @Prop()
  emergencyContactName?: string;

  @Prop()
  emergencyContactPhone?: string;

  // ========= JOB / ORG INFO (HR-governed) =========
  @Prop({ unique: true, sparse: true })
  employeeNo?: string; // e.g. "EMP-000123"

  @Prop()
  department?: string; 

  @Prop()
  jobTitle?: string; // "Software Engineer", "HR Generalist", etc.

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' })
  manager?: mongoose.Types.ObjectId; // reporting line

  @Prop({ type: Date })
  hireDate?: Date;

  @Prop({
    type: String,
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  employmentStatus: EmploymentStatus;

  // ========= LIFECYCLE / OFFBOARDING =========
  @Prop({ type: Date })
  terminationDate?: Date;

  @Prop({ type: Date })
  resignationDate?: Date;

  @Prop({ default: true })
  isActive: boolean;

  // ========= OTHER =========
  @Prop()
  profilePhotoUrl?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
