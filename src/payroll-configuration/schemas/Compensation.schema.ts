import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CompensationDocument = Compensation & Document;

@Schema({ timestamps: true })
export class Compensation {
    // Type identifier - Allowance or Termination/Resignation benefit
    @Prop({
        enum: ['Allowance', 'Termination', 'Resignation'],
        required: true,
    })
    CompensationName!: string;

    // Numeric value or formula expression (e.g., "500" or "baseSalary * 0.1")
    @Prop({ required: true })
    amount!: string;

    // Approval status - Draft, Approved, or Rejected
    @Prop({
        enum: ['Draft', 'Approved', 'Rejected'],
        required: true,
        default: 'Draft',
    })
    status!: string;
}

export const CompensationSchema = SchemaFactory.createForClass(Compensation);

