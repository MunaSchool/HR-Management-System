import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../models/employee-profile.schema';
import { UpdateEmployeeMasterDto } from '../dto/update-employee-master.dto';
import { SystemRole, EmployeeStatus } from '../enums/employee-profile.enums';

@Injectable()
export class HrAdminService {
  constructor(
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
  ) {}

  // ===============================================
  // Search employees (US-E6-03)
  // ===============================================
  async searchEmployees(
    searchQuery: string,
    status?: EmployeeStatus,
    departmentId?: string,
  ): Promise<EmployeeProfileDocument[]> {
    const filter: any = {};

    if (searchQuery) {
      filter.$or = [
        { employeeNumber: { $regex: searchQuery, $options: 'i' } },
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { workEmail: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (departmentId) {
      filter.primaryDepartmentId = departmentId;
    }

    // Fetch employees without populate first
    const employees = await this.employeeProfileModel.find(filter).exec();

    // Manually populate only valid ObjectIds (not empty strings)
    for (const emp of employees) {
      if (emp.primaryPositionId && emp.primaryPositionId.toString() !== '') {
        await emp.populate('primaryPositionId');
      }
      if (emp.primaryDepartmentId && emp.primaryDepartmentId.toString() !== '') {
        await emp.populate('primaryDepartmentId');
      }
    }

    return employees;
  }

  // ===============================================
  // Update employee master data (US-EP-04)
  // ===============================================
  async updateEmployeeMasterData(
    employeeId: string,
    userId: string,
    userRole: string,
    updateDto: UpdateEmployeeMasterDto,
  ): Promise<EmployeeProfileDocument> {
    if (
      ![
        SystemRole.HR_ADMIN,
        SystemRole.HR_MANAGER,
        SystemRole.SYSTEM_ADMIN,
      ].includes(userRole as SystemRole)
    ) {
      throw new ForbiddenException('Insufficient permissions');
    }

    console.log('🔍 Updating employee:', employeeId);
    console.log('📦 Update data received:', JSON.stringify(updateDto, null, 2));

    const updated = await this.employeeProfileModel.findByIdAndUpdate(
      employeeId,
      {
        ...updateDto,
        lastModifiedBy: userId,
        lastModifiedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Employee profile not found');
    }

    console.log('✅ Employee updated:', {
      id: updated._id,
      name: updated.fullName,
      primaryDepartmentId: updated.primaryDepartmentId,
      primaryPositionId: updated.primaryPositionId,
      supervisorPositionId: updated.supervisorPositionId,
    });

    return updated;
  }

  // ===============================================
  // Deactivate employee or change status (US-EP-05)
  // ===============================================
  async deactivateEmployee(
    employeeId: string,
    userId: string,
    userRole: string,
    status: EmployeeStatus,
    effectiveDate?: Date,
  ): Promise<EmployeeProfileDocument> {
    if (
      ![
        SystemRole.HR_ADMIN,
        SystemRole.HR_MANAGER,
        SystemRole.SYSTEM_ADMIN,
      ].includes(userRole as SystemRole)
    ) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const updated = await this.employeeProfileModel.findByIdAndUpdate(
      employeeId,
      {
        status,
        statusEffectiveFrom: effectiveDate || new Date(),
        lastModifiedBy: userId,
        lastModifiedAt: new Date(),
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Employee profile not found');
    }

    return updated;
  }
}
