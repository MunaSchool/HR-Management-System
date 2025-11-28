import { ShiftAssignmentCreateDto } from './../dtos/shift-assignment-create-dto';
import { ShiftAssignmentDocument, ShiftAssignmentSchema } from './../models/shift-assignment.schema';
import { BadRequestException, Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ShiftAssignment } from "../models/shift-assignment.schema";
import { Model } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../../employee-profile/models/employee-profile.schema';
import { Department, DepartmentDocument } from '../../organization-structure/models/department.schema';
import { Position, PositionDocument } from '../../organization-structure/models/position.schema';
import { Shift, ShiftDocument } from '../models/shift.schema';
import { throws } from 'assert';

@Injectable()
export class ShiftAssignmentService{
    constructor(
        @InjectModel(ShiftAssignment.name) 
        private shiftAssignmentModel:Model<ShiftAssignmentDocument>,
        @InjectModel(EmployeeProfile.name)
        private employeeProfileModel: Model<EmployeeProfileDocument>,
        @InjectModel(Department.name)
        private departmentModel: Model<DepartmentDocument>,
        @InjectModel(Position.name)
        private positionModel:Model<PositionDocument>,
        @InjectModel(Shift.name)
        private shiftModel: Model<ShiftDocument>
){}
    async assignShift(assignData:ShiftAssignmentCreateDto){
        if(!assignData.employeeId&&!assignData.departmentId&&!assignData.positionId){
            throw new BadRequestException("Either Employee ID, Department ID or Position ID must be provided!");
        }
        const dataLength = [
            assignData.employeeId,assignData.departmentId,assignData.positionId
        ].filter(Boolean).length
        if(dataLength>1){
            throw new BadRequestException("Only provide either Employee ID, Department ID or Position ID");
        }
        if(!assignData.shiftId){
            throw new BadRequestException("Shift ID must be provided!")
        }

        if(assignData.employeeId){
            const employee = await this.employeeProfileModel.findById(assignData.employeeId)
            if(!employee) throw new NotFoundException("Employee not found!")
        }
        if(assignData.departmentId){
            const department = await this.departmentModel.findById(assignData.departmentId)
            if(!department) throw new NotFoundException("Department not found!")
        }
        if(assignData.positionId){
            const position = await this.positionModel.findById(assignData.positionId)
            if(!position) throw new NotFoundException("Position not found!")
        }
        const shift = await this.shiftModel.findById(assignData.shiftId)
        if(!shift) throw new NotFoundException("Shift not found!")
        //Put the data in an object and pass it to the shift assignment model using create function
    }
    
}