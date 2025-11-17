import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type PayrollDraftDocument = PayrollDraft & Document;

@Schema({ timestamps: true })
export class PayrollDraft {
    @Prop({ type: Types.ObjectId, ref: 'PayrollCycle', required: true })
    payrollCycle!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true }) 
    employee!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'PayGrade' })
    payGrade!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'TaxRule' })
    taxRule!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Insurance' })
    insuranceBracket!: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Bonus' }], default: [] })
    appliedBonuses!: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Compensation' }], default: [] })
    appliedCompensations!: Types.ObjectId[];

    @Prop()
    gross!: number;

    @Prop()
    taxes!: number;

    @Prop()
    insurance!: number;

    @Prop()
    penalties!: number;

    @Prop()
    netSalary!: number;

    @Prop()
    finalSalary!: number;

    @Prop({
    type: [
        {
        label: String,
        amount: Number,
        type: String,
        },
    ],
    default: [],
    })
    breakdown!: { label: string; amount: number; type: string }[];



    @Prop({
    enum: ['Draft', 'Flagged', 'Resolved', 'Finalized'],
    default: 'Draft',
    })
    status!: string;


}  

export const PayrollDraftSchema = SchemaFactory.createForClass(PayrollDraft);


