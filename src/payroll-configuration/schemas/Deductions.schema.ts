import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeductionsDocument = Deductions & Document;

@Schema({ timestamps: true })
export class Deductions {
 @Prop ({
type: String,
required: true,
 })
 deductionName:string;
   
 @Prop ({
enum: ['Percentage', 'Fixed Amount','Brackets'],
default: 'Fixed Amount',
})
rules:string;

@Prop({
    type: [String],
    required: false,
    default: [],
  })
  exemptions: string[];

@Prop ({
enum: ['Draft', 'Approved', 'Rejected'],
default: 'Draft',
})
status:string;
}
export const DeductionsSchema = SchemaFactory.createForClass(Deductions);

