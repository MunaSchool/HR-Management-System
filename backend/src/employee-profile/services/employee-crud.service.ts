import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
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
    const { systemRoles, permissions, password, ...profileData } = employeeData;

    // Check if employee number already exists
    const existingEmployeeNumber = await this.employeeProfileModel.findOne({
      employeeNumber: profileData.employeeNumber,
    });
    if (existingEmployeeNumber) {
      throw new ConflictException(`Employee number '${profileData.employeeNumber}' already exists`);
    }

    // Check if national ID already exists
    if (profileData.nationalId) {
      const existingNationalId = await this.employeeProfileModel.findOne({
        nationalId: profileData.nationalId,
      });
      if (existingNationalId) {
        throw new ConflictException(`National ID '${profileData.nationalId}' already exists`);
      }
    }

    // Check if work email already exists
    if (profileData.workEmail) {
      const existingEmail = await this.employeeProfileModel.findOne({
        workEmail: profileData.workEmail,
      });
      if (existingEmail) {
        throw new ConflictException(`Work email '${profileData.workEmail}' already exists`);
      }
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    console.log('📝 Creating employee with data:', {
      ...profileData,
      hasPassword: !!hashedPassword,
    });

    // Create employee profile
    const fullName = `${profileData.firstName}${profileData.middleName ? ' ' + profileData.middleName : ''} ${profileData.lastName}`;
    const newEmployee = await this.employeeProfileModel.create({
      ...profileData,
      ...(hashedPassword && { password: hashedPassword }),
      fullName,
    });

    console.log('✅ Employee created:', {
      _id: newEmployee._id,
      fullName: newEmployee.fullName,
      workEmail: newEmployee.workEmail,
      personalEmail: newEmployee.personalEmail,
      mobilePhone: newEmployee.mobilePhone,
      homePhone: newEmployee.homePhone,
    });

    // Always create role assignment (default to department employee if no roles provided)
    const assignedRoles = systemRoles && systemRoles.length > 0 ? systemRoles : ['department employee'];

    try {
      const roleAssignment = await this.employeeRoleModel.create({
        employeeProfileId: new Types.ObjectId(newEmployee._id),
        roles: assignedRoles,
        permissions: permissions || [],
        isActive: true,
      });

      // Link role to employee
      const updated = await this.employeeProfileModel.findByIdAndUpdate(
        newEmployee._id,
        { accessProfileId: roleAssignment._id },
        { new: true }
      ).populate('accessProfileId');

      if (!updated) {
        throw new NotFoundException('Employee profile not found after role assignment');
      }

      return updated;
    } catch (error) {
      // If role creation fails, delete the employee to maintain data consistency
      await this.employeeProfileModel.findByIdAndDelete(newEmployee._id);
      throw error;
    }
  }

  // Get all employee profiles
  async findAll(): Promise<any[]> {
    const employees = await this.employeeProfileModel
      .find()
      .populate('accessProfileId')
      .exec();

    // Manually populate all fields only when valid
    for (const emp of employees) {
      if (emp.primaryPositionId && emp.primaryPositionId.toString() !== '') {
        await emp.populate('primaryPositionId');
      }
      if (emp.primaryDepartmentId && emp.primaryDepartmentId.toString() !== '') {
        await emp.populate('primaryDepartmentId');
      }
      if (emp.payGradeId && Types.ObjectId.isValid(emp.payGradeId)) {
        await emp.populate('payGradeId');
      }
    }

    // Map employees to include roles and properly formatted data
    return employees.map(emp => {
      const empObj = emp.toObject();
      const roles = (empObj.accessProfileId as any)?.roles || [];
      const payGrade = (empObj.payGradeId as any)?.grade || null;

      return {
        ...empObj,
        email: empObj.workEmail, // Add email field for frontend compatibility
        roles, // Add roles at top level
        payGrade, // Add payGrade name for display
      };
    });
  }

  // Get an employee profile by ID
  async findById(id: string): Promise<any> {
    let employee = await this.employeeProfileModel
      .findById(id)
      .populate('accessProfileId')
      .exec();

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    // Manually populate only valid fields (handles null and empty string)
    if (employee.primaryPositionId && employee.primaryPositionId.toString() !== '') {
      await employee.populate('primaryPositionId');
    }
    if (employee.primaryDepartmentId && employee.primaryDepartmentId.toString() !== '') {
      await employee.populate('primaryDepartmentId');
    }
    if (employee.payGradeId && Types.ObjectId.isValid(employee.payGradeId)) {
      await employee.populate('payGradeId');
    }

    const finalEmpObj = employee.toObject();
    const roles = (finalEmpObj.accessProfileId as any)?.roles || [];
    const payGrade = (finalEmpObj.payGradeId as any)?.grade || null;

    return {
      ...finalEmpObj,
      email: finalEmpObj.workEmail, // Add email field for frontend compatibility
      roles, // Add roles at top level
      payGrade, // Add payGrade name for display
    };
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
