import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from 'mongoose';

export enum ShiftStatus{
    Approved = 'Approved',
    Cancelled = "Cancelled",
    Expired = "Expired"

}
@Schema({ timestamps: true })
export class ShiftAssignment{
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
        shiftId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
        employeeId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
        departmentId:mongoose.Schema.Types.ObjectId;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId})
        positionId?:mongoose.Schema.Types.ObjectId;
        
    @Prop({default: ShiftStatus.Approved})
        status:ShiftStatus;

    @Prop({default: Date.now()})
        expiryDate: Date;

    @Prop() 
        lastModifiedBy?: mongoose.Schema.Types.ObjectId;
        
}
export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>
export const ShiftAssignmentSchema = SchemaFactory.createForClass(ShiftAssignment)