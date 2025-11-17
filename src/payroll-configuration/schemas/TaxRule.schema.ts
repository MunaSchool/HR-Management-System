import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TaxRuleDocument = TaxRule & Document;

@Schema({ timestamps: true })
export class TaxRule {
    // Tax rule name/identifier
    @Prop({ required: true })
    ruleName!: string;

    // Tax type - Income Tax, Social Security, etc.
    @Prop({
        enum: ['Income Tax', 'Social Security', 'Medicare', 'State Tax', 'Local Tax'],
        required: true,
    })
    taxType!: string;

    // Calculation method - Percentage, Fixed Amount, or Brackets
    @Prop({
        enum: ['Percentage', 'Fixed Amount', 'Brackets'],
        required: true,
        default: 'Brackets',
    })
    calculationMethod!: string;


    // Minimum income threshold (exemption threshold)
    @Prop({ required: false, default: 0 })
    exemptionThreshold?: number;

    // Applicability - who this tax applies to
    @Prop({
        type: [String],
        default: [],
        enum: ['All Employees', 'Full-time', 'Part-time', 'Temporary', 'Contractor'],
    })
    applicability!: string[];

    // Law reference or legal basis
    @Prop({ required: false })
    lawReference?: string;

    // Description of the tax rule
    @Prop({ required: false })
    description?: string;

    // Approval status - Draft, Approved, or Rejected
    @Prop({
        enum: ['Draft', 'Approved', 'Rejected'],
        required: true,
        default: 'Draft',
    })
    status!: string;
}

export const TaxRuleSchema = SchemaFactory.createForClass(TaxRule);

