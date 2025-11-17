//5
import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type InsuranceDocument = Insurance & Document;
@Schema({ timestamps: true })
export class Insurance {
    //#1
    // REQ-PY-21
    @Prop ({required: true})
    bracketName!: string;

    //#2
    // REQ-PY-21
    @Prop ({ required: true })
    minSalary!: number;

    //#3
    // REQ-PY-21
    @Prop ({ required: true })
    maxSalary!: number;

    //#4
    // REQ-PY-21
    @Prop ({ required: true }) //maxSalary - minSalary
    salaryRange!: string;

    //#5
    // REQ-PY-21
    @Prop ({ required: true }) //must be %
    employeeContribution!: number;

    //#6
    // REQ-PY-21
    @Prop ({ required: true }) //must be %
    employerContribution!: number;

    //#7
    // REQ-PY-21
    @Prop ({ enum: ['Draft', 'Approved', 'Rejected'], default: 'Draft' })
    insuranceStatus!: string;


    //#8
    // REQ-PY-21
    //////////pls ask if this is needed or correct aslun//////////
    @Prop ({ enum: ['Create', 'Edit', 'View'], default: 'View' })
    insuranceConfiguration!: string;


}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);