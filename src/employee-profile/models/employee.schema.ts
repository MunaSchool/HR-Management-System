// src/employee/schemas/employee.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../enums/role.enum';
import { EmploymentStatus } from '../enums/employment-status.enum';

export type EmployeeDocument = HydratedDocument<Employee>;

// ======================================
// 📌 ENUMS
// ======================================
export enum ContractType {
  PERMANENT = 'PERMANENT',
  FIXED_TERM = 'FIXED_TERM',
  PROBATION = 'PROBATION',
  INTERN = 'INTERN',
}

// ======================================
// 📌 EMBEDDED SUBDOCUMENTS
// ======================================
@Schema({ _id: false })
export class EducationEntry {
  @Prop()
  degree?: string;          // e.g. BSc Computer Science

  @Prop()
  institution?: string;     // e.g. German International University

  @Prop()
  fieldOfStudy?: string;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;
}

@Schema({ timestamps: true })
export class Employee {
  // ======================================
  // 📌 AUTH / ACCOUNT INFORMATION
  // ======================================
  @Prop({ required: true, unique: true })
  workEmail: string;        // official company email (login)

  @Prop({ required: true })
  password: string;         // hashed

  @Prop({
    required: true,
    enum: Role,
    default: Role.EMPLOYEE,
    type: String,
  })
  role: Role;

  // ======================================
  // 📌 PERSONAL INFORMATION (HR-GOVERNED)
  // ======================================
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
  gender?: string; // or enum

  @Prop()
  nationality?: string;

  @Prop()
  maritalStatus?: string; // or enum if you prefer

  // ======================================
  // 📌 CONTACT INFORMATION (SELF-SERVICE)
  // (BR 2g, 2n, 2o – system can store Phone, Email, Address)
  // ======================================
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

  // ======================================
  // 📌 ORGANIZATIONAL STRUCTURE LINKING
  // (Actual Departments & Positions, NOT strings)
  // ======================================
  @Prop({ unique: true, sparse: true })
  employeeNo?: string; // e.g., EMP-0001

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Department' })
  department?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Position' })
  position?: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' })
  manager?: mongoose.Types.ObjectId; // reporting line

  // ======================================
  // 📌 EMPLOYMENT & CONTRACT DETAILS
  // ======================================
  @Prop({ type: Date })
  hireDate?: Date;

  @Prop({ type: Date })
  contractStartDate?: Date;

  @Prop({ type: Date })
  contractEndDate?: Date; // for fixed-term or probation

  @Prop({
    type: String,
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  employmentStatus: EmploymentStatus;

  @Prop({
    type: String,
    enum: ContractType,
  })
  contractType?: ContractType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PayGrade' })
  payGrade?: mongoose.Types.ObjectId;

  // ======================================
  // 📌 EDUCATION & BACKGROUND (BR 3h)
  // ======================================
  @Prop({ type: [EducationEntry], default: [] })
  education?: EducationEntry[];

  // ======================================
  // 📌 PERFORMANCE HISTORY (DOWNSTREAM INPUT)
  // ======================================
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appraisal' }],
    default: [],
  })
  appraisalHistory: mongoose.Types.ObjectId[];

  // ======================================
  // 📌 OFFBOARDING INFORMATION
  // ======================================
  @Prop({ type: Date })
  terminationDate?: Date;

  @Prop({ type: Date })
  resignationDate?: Date;

  @Prop({ default: true })
  isActive: boolean;

  // ======================================
  // 📌 MEDIA & MISC
  // ======================================
  @Prop()
  profilePhotoUrl?: string;

  @Prop()
  bio?: string; // short biography (US-E2-12)
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// ======================================
// 📌 INDEXES (for search & manager/team views)
// ======================================

