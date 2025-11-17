import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {HydratedDocument} from 'mongoose';

export enum ShiftType{
   Normal = 'Normal',
   Rotational = 'Rotational',
   Split = 'Split',
   Overnight = 'Overnight'
}

@Schema()
export class Shift{
    @Prop()
        shiftName: string;
        
    @Prop({enum: ShiftType , default: ShiftType.Normal})
        shiftType: ShiftType;
}
export type ShiftDocument = HydratedDocument<Shift>
export const ShiftSchema = SchemaFactory.createForClass(Shift)