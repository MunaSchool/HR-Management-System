import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum CorrectionStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Escalated = 'Escalated'
}


export class CorrectionRequest {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' })
    attendanceId: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
    requestedBy: mongoose.Schema.Types.ObjectId; 

    @Prop({ type: mongoose.Schema.Types.ObjectId })
    approvedBy?: mongoose.Schema.Types.ObjectId; 

    @Prop({ required: true })
    reason: string; 
    
    @Prop({ enum: CorrectionStatus, default: CorrectionStatus.Pending })
    status: CorrectionStatus;
    
    @Prop()
    correctionDate?: Date; 
}

export type CorrectionRequestDocument = HydratedDocument<CorrectionRequest>;
export const CorrectionRequestSchema = SchemaFactory.createForClass(CorrectionRequest);
