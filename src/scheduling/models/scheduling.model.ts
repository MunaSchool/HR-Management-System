import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum Recurrence {
    Daily = 'Daily',
    Weekly = 'Weekly',
    Monthly = 'Monthly',
    Custom = 'Custom',
}

@Schema()
export class Scheduling {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ShiftAssignment', required: true })
    shiftAssignmentId: mongoose.Schema.Types.ObjectId;

    @Prop({ default: Date.now })
    startDate: Date;

    @Prop()
    endDate?: Date;

    @Prop({ enum: Recurrence, default: Recurrence.Daily })
    recurrence: Recurrence;

    @Prop({ type: [Number] }) // 0 = Sunday, 6 = Saturday
    daysOfWeek?: number[];

    @Prop()
    customPattern?: string; // e.g., "4-on/3-off"

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    flexInTime?: number;  

    @Prop()
    flexOutTime?: number; 

    @Prop({ default: false })
    allowMultiplePunches?: boolean; // multiple punches = true, first in last out = false
}

export type SchedulingDocument = HydratedDocument<Scheduling>;
export const SchedulingSchema = SchemaFactory.createForClass(Scheduling);
