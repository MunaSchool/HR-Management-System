import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VacationPackageDocument = HydratedDocument<VacationPackage>;

@Schema({ collection: 'vacation_packages', timestamps: true, versionKey: false })
export class VacationPackage {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, min: 0 })
  annualEntitlement: number;

  @Prop({ default: true })
  accrualEnabled: boolean;

  @Prop({ enum: ['monthly', 'quarterly', 'annual'], default: 'monthly' })
  accrualRate: string;

  @Prop({ default: 45, min: 0 })
  carryOverLimit: number;

  // Phase 3 — Pause accrual during unpaid leave or suspension
  @Prop({ default: true })
  pauseDuringUnpaid: boolean;

  // Phase 3 — Date on which balances reset each year
  @Prop()
  resetDate?: Date;

  // Phase 3 — Link to employment grade / tenure logic
  @Prop()
  gradeLevel?: string;

  @Prop()
  tenureRange?: string;
}

export const VacationPackageSchema = SchemaFactory.createForClass(VacationPackage);
