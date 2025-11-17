import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Allowance } from "./allowance.schema";

export type PayGradeDocument = PayGrade & Document;

@Schema({ timestamps: true })
export class PayGrade {
//remove his comment latwe this is a test

    //#1
    //REQ-PY-2 , BR_1,9
    // this is from employee.schema.ts (organizational structure)
    @Prop({ type: Types.ObjectId, ref: 'Position' }) //???? go back to this tbh
    positionId?: Types.ObjectId;

    //#2
    //REQ-PY-2 , BR 10, 31
    @Prop ({ required: true, default: 0.0 })
    basePayment!: number; ///////reference to another schema?????

    @Prop ({ required: true , default: 0.0 })
    GrossPay!: number;

    //#3
    // REQ-PY-2 
    @Prop ({ type: Types.ObjectId, ref: 'Allowance' }) //reference
    allowances?: Types.ObjectId;

    @Prop ({ 
    enum: ['Draft', 'Approved', 'Rejected'],
    required: true,
    })
    PayGradeStatus!:string;

    //REQ-PY-2
    //////////pls ask if this is needed or correct aslun//////////
    @Prop ({ enum: ['Create', 'Edit', 'View'], default: 'View' })
    payGradeConfiguration!: string;

}

export const PayGradeSchema = SchemaFactory.createForClass(PayGrade);
