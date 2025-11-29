import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../models/employee-profile.schema';

@Injectable()
export class EmployeeCrudService {
  constructor(
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
  ) {}

  // Create a new employee profile
  async create(employeeData: Partial<EmployeeProfile>): Promise<EmployeeProfileDocument> {
    const newEmployee = new this.employeeProfileModel(employeeData);
    return await newEmployee.save();
  }

  // Get all employee profiles
  async findAll(): Promise<EmployeeProfileDocument[]> {
    const employees = await this.employeeProfileModel.find();
    return employees;
  }

  // Get an employee profile by ID
  async findById(id: string): Promise<EmployeeProfileDocument> {
    const employee = await this.employeeProfileModel.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }
    return employee;
  }

  // Update an employee profile by ID
  async update(id: string, updateData: Partial<EmployeeProfile>): Promise<EmployeeProfileDocument> {
    const updatedEmployee = await this.employeeProfileModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedEmployee) {
      throw new NotFoundException('Employee profile not found');
    }
    return updatedEmployee;
  }

  // Delete an employee profile by ID
  async delete(id: string): Promise<EmployeeProfileDocument> {
    const deletedEmployee = await this.employeeProfileModel.findByIdAndDelete(id);
    if (!deletedEmployee) {
      throw new NotFoundException('Employee profile not found');
    }
    return deletedEmployee;
  }
}
