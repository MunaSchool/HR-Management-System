import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type BonusDocument = Bonus & Document;

@Schema({ timestamps: true })
export class Bonus {
    // Bonus type - Signing Bonus or Performance Bonus
    @Prop({
        enum: ['Signing', 'Performance'],
        required: true,
    })
    BonusName!: string;

    @Prop({ required: true })
    BonusAmount!: number;

    // Approval status - Draft, Approved, or Rejected
    @Prop({
        enum: ['Draft', 'Approved', 'Rejected'],
        required: true,
        default: 'Draft',
    })
    status!: string;
}

export const BonusSchema = SchemaFactory.createForClass(Bonus);

