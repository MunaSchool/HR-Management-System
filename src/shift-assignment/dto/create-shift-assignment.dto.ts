import {IsEnum, IsNumber, IsOptional, IsDateString} from 'class-validator'
import { ShiftStatus } from '../models/shift-assignment.model';
export class CreateShiftAssignmentDto {
    @IsNumber()
    shiftId: number;

    @IsNumber()
    @IsOptional()
    employeeId: number;

    @IsNumber()
    @IsOptional()
    departmentId: number;

    @IsNumber()
    @IsOptional()
    positionId:number;

    @IsEnum(ShiftStatus)
    status:ShiftStatus;

    @IsDateString()
    expiryDate: Date;


}
