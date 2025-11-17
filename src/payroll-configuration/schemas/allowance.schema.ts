import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type AllowanceDocument = Allowance & Document;

@Schema({ timestamps: true })
export class Allowance {
    //#5
    // REQ-PY-5
    @Prop ({ 
    enum: ['Draft', 'Approved', 'Rejected'],
    required: true,
    })
    AllowanceStatus!:string;

    // REQ-PY-2 
    @Prop ({ required: true, default: 0.0 }) //reference
    allowances!: number;
    
    //REQ-PY-5
    //////////pls ask if this is needed or correct aslun//////////
    @Prop ({ enum: ['Create', 'Edit', 'View'], default: 'View' })
    AllowanceConfiguration!: string;
}
export const AllowanceSchema = SchemaFactory.createForClass(Allowance);