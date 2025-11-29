import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../models/employee-profile.schema';
import { EmployeeSystemRole } from '../models/employee-system-role.schema';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@Injectable()
export class EmployeeCrudService {
  constructor(
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
    @InjectModel(EmployeeSystemRole.name)
    private employeeRoleModel: Model<EmployeeSystemRole>,
  ) {}

  // Create a new employee profile with role assignment
  async create(employeeData: CreateEmployeeDto): Promise<EmployeeProfileDocument> {
    const { roles, permissions, ...profileData } = employeeData;

    // Create employee profile
    const newEmployee = await this.employeeProfileModel.create({
      ...profileData,
      fullName: `${profileData.firstName} ${profileData.lastName}`,
    });

    // Create role assignment
    const roleAssignment = await this.employeeRoleModel.create({
      employeeProfileId: newEmployee._id,
      roles: roles,
      permissions: permissions || [],
      isActive: true,
    });

    // Link role to employee
    const updated = await this.employeeProfileModel.findByIdAndUpdate(
      newEmployee._id,
      { accessProfileId: roleAssignment._id },
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('Employee profile not found');
    }

    return updated;
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
