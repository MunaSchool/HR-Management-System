import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PayrollCycleDocument = PayrollCycle & Document;

@Schema({ timestamps: true })
export class PayrollCycle {

    @Prop({
    type: {
        startDate: Date,
        endDate: Date,
    },
    required: true,
    })
    period!: { startDate: Date; endDate: Date };

/////
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Bonus' }] })
    bonusesPendingApproval!: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Compensation' }], default: [] })
    compensationsPendingApproval!: Types.ObjectId[];
/////
    @Prop({
    enum: [
      'Draft',
      'PeriodApproved',
      'Initiated',
      'DraftGenerated',
      'UnderReview',
      'PendingManagerApproval',
      'PendingFinanceApproval',
      'Locked',
      'Paid',
      'Unfrozen'
    ],
    default: 'Draft',
    })
    status!: string;

    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true }) 
    createdBy!: Types.ObjectId;


    @Prop({ type: Types.ObjectId, ref: 'Employee' })
    approvedBy?: Types.ObjectId;


    @Prop({ type: Types.ObjectId, ref: 'Employee' })
    financeApprovedBy?: Types.ObjectId;


    @Prop({ type: Types.ObjectId, ref: 'Employee' })
    lockedBy?: Types.ObjectId;

    @Prop({ type: String })
    unfreezeReason?: string;

    @Prop({ default: 0 })
    employeeCount!: number;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'PayrollDraft' }], default: [] })
    drafts!: Types.ObjectId[];


}
export const PayrollCycleSchema = SchemaFactory.createForClass(PayrollCycle);