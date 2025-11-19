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
// 📌 EMBEDDED SUBDOCUMENTS (BR 3h – Education details)
// ======================================
@Schema({ _id: false })
export class EducationEntry {
  @Prop()
  degree?: string;

  @Prop()
  institution?: string;

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
  // (NFR-14, US-E7-05 – roles & secure login)
  // ======================================
  @Prop({ required: true, unique: true })
  workEmail: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.EMPLOYEE,
    type: String,
  })
  role: Role;

  // ======================================
  // 📌 PERSONAL INFORMATION (HR-GOVERNED)
  // (BR 2a-r – core personal data; Onboarding input)
  // ======================================
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  nationalId?: string;

  @Prop({ type: Date })
  dateOfBirth?: Date;

  @Prop()
  maritalStatus?: string; // mentioned explicitly in change-request action (Action 3)

  // ======================================
  // 📌 CONTACT INFORMATION (SELF-SERVICE)
  // (US-E2-05, BR 2g, 2n, 2o – address, phone, email)
  // ======================================
  @Prop()
  personalEmail?: string;

  @Prop()
  mobilePhone?: string;

  @Prop()
  address?: string;

  // ======================================
  // 📌 ORGANIZATIONAL STRUCTURE LINKING
  // (Org Structure dependency + manager view US-E4-01/02)
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
  // (Onboarding + BR 3b, 3f, 3g, 3j + Payroll dependency)
  // ======================================
  @Prop({ type: Date })
  hireDate?: Date; // Date of Hire

  @Prop({
    type: String,
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  employmentStatus: EmploymentStatus; // Active / On Leave / Suspended / Retired (BR 3j)

  @Prop({
    type: String,
    enum: ContractType,
  })
  contractType?: ContractType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PayGrade' })
  payGrade?: mongoose.Types.ObjectId; // Payroll & Benefits dependency

  // ======================================
  // 📌 EDUCATION & BACKGROUND (BR 3h)
  // ======================================
  @Prop({ type: [EducationEntry], default: [] })
  education?: EducationEntry[];

  // ======================================
  // 📌 PERFORMANCE HISTORY (DOWNSTREAM INPUT)
  // (BR 16 – Appraisal records saved on profile)
  // ======================================
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appraisal' }],
    default: [],
  })
  appraisalHistory: mongoose.Types.ObjectId[];

  // ======================================
  // 📌 OFFBOARDING INFORMATION
  // (Leaves/Offboarding → status & dates)
  // ======================================
  @Prop({ type: Date })
  terminationDate?: Date;

  @Prop({ type: Date })
  resignationDate?: Date;

  // ======================================
  // 📌 MEDIA & SELF-SERVICE PROFILE CONTENT
  // (US-E2-12 – profile picture & short biography)
  // ======================================
  @Prop()
  profilePhotoUrl?: string;

  @Prop()
  bio?: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// ======================================
// 📌 INDEXES (US-E6-03 – search employees data, NFR – performance)
// ======================================

