import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type LegalChangeDocument = LegalChange & Document;

@Schema({ timestamps: true })
export class LegalChange {
    @Prop({ unique: true, required: true })
    LegalChangeID!: string;

    // Legal change title/name
    @Prop({ required: true })
    title!: string;

    // Description of the legal change
    @Prop({ required: true })
    description!: string;

    // Law reference or legal document
    @Prop({ required: true })
    lawReference!: string;

    // Announcement date (when the law was announced)
    @Prop({ required: false })
    announcementDate?: Date;

    // Priority level
    @Prop({
        enum: ['Low', 'Medium', 'High', 'Critical'],
        required: true,
        default: 'Medium',
    })
    priority!: string;

    // Status of implementation
    @Prop({
        enum: ['Pending Review', 'In Progress', 'Implemented', 'Rejected', 'Deferred'],
        required: true,
        default: 'Pending Review',
    })
    implementationStatus!: string;

    // Approval status - Draft, Approved, or Rejected
    @Prop({
        enum: ['Draft', 'Approved', 'Rejected'],
        required: true,
        default: 'Draft',
    })
    status!: string;

    // Audit details
    @Prop({
        type: {
            createdBy: { type: String, required: true },
            updatedBy: { type: String },
            reviewedBy: { type: String },
        },
        required: true,
    })
    auditDetails!: {
        createdBy: string;
        updatedBy?: string;
        reviewedBy?: string;
    };
}

export const LegalChangeSchema = SchemaFactory.createForClass(LegalChange);

