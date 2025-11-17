// src/employee/employee.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './models/employee.schema';
import { EmploymentStatus } from './enums/employment-status.enum';

@Injectable()
export class EmployeeProfileService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}
}
