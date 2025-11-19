import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from 'mongoose';

export enum ShiftStatus{
    Approved = 'Approved',
    Cancelled = "Cancelled",
    Expired = "Expired"

}
@Schema({ timestamps: true })
export class ShiftAssignment{
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Shift'})
        shiftId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee'})
        employeeId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee.department'})
        departmentId:mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee.jobTitle'})
        positionId?:mongoose.Schema.Types.ObjectId;
        
    @Prop({default: ShiftStatus.Approved})
        status:ShiftStatus;

    @Prop({default: Date.now()})
        expiryDate: Date;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}) 
        lastModifiedBy?: mongoose.Schema.Types.ObjectId;
        
}
export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>
export const ShiftAssignmentSchema = SchemaFactory.createForClass(ShiftAssignment)