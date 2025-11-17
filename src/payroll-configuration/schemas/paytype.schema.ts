//2
import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type PayTypeDocument = PayType & Document;

@Schema({ timestamps: true })
export class PayType {

    //#4
    // REQ-PY-5
    @Prop({   
    enum: ['Monthly', 'Weekly' , 'Hourly'],
    default: 'Monthly',
    required: true,
  })
    payType!: string;

    //#5
    // REQ-PY-5
    @Prop ({ 
        enum: ['Draft', 'Approved', 'Rejected'],
        required: true,
    })
    PayTypeStatus!:string;

    //REQ-PY-5
    //////////pls ask if this is needed or correct aslun//////////
    @Prop ({ enum: ['Create', 'Edit', 'View'], default: 'View' })
    payTypeConfiguration!: string;

}

export const PayTypeSchema = SchemaFactory.createForClass(PayType);