import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, {HydratedDocument} from 'mongoose';

export enum ShiftStatus{
    Approved = 'Approved',
    Cancelled = "Cancelled",
    Expired = "Expired"

}
@Schema()
export class ShiftAssignment{
    @Prop({required: true})
        shiftId: number;
    @Prop()
        employeeId?: number;
    @Prop()
        departmentId?:number;
    @Prop()
        positionId?:number;
    @Prop()
        status:string;
    @Prop()
        expiryDate: Date;
        
}
export type ShiftAssignmentDocument = HydratedDocument<ShiftAssignment>
export const ShiftAssignmentSchema = SchemaFactory.createForClass(ShiftAssignment)