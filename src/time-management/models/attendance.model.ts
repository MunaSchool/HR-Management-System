import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';

@Schema()
export class Attendance{
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee'})
        employeeId: mongoose.Schema.Types.ObjectId;

    @Prop({default:Date.now})
        timestamp:Date;

    @Prop({required:true, enum: ["In", "Out"]})
        type: "In" | "Out"

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ShiftAssignment' })
        shiftId?: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CorrectionRequest' })
        correctionRequestId?: mongoose.Types.ObjectId;

    
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Employee'})
        correctedBy?:mongoose.Schema.Types.ObjectId;
}
export type AttendanceDocument = HydratedDocument<Attendance>
export const AttendanceSchema = SchemaFactory.createForClass(Attendance)