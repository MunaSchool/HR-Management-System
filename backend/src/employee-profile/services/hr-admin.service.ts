import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../models/employee-profile.schema';
import { UpdateEmployeeMasterDto } from '../dto/update-employee-master.dto';
import { SystemRole, EmployeeStatus } from '../enums/employee-profile.enums';

@Injectable()
export class HrAdminService {
  constructor(
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
  ) {}

  // Helper to resolve supervisorPositionId from organizational structure
  private async resolveSupervisorPositionId(primaryPositionId: any): Promise<Types.ObjectId | undefined> {
    if (!primaryPositionId) {
      console.warn("⚠️ No primaryPositionId provided — cannot resolve supervisor");
      return undefined;
    }

    console.log("🔍 Resolving supervisor for position:", primaryPositionId);

    const PositionModel = this.employeeProfileModel.db.model('Position');
    const position = await PositionModel.findById(primaryPositionId).exec();

    if (!position) {
      console.error("❌ Position not found:", primaryPositionId);
      return undefined;
    }

    console.log("🏷️ Loaded position:", position._id);
    console.log("📋 Position title:", position.title);
    console.log("⬆️ Position reportsToPositionId:", position.reportsToPositionId);

    if (!position.reportsToPositionId) {
      console.warn("⚠️ Position has no reportsToPositionId (department head or top-level position)");
      return undefined;
    }

    console.log("✅ supervisorPositionId resolved:", position.reportsToPositionId);
    return position.reportsToPositionId;
  }

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

    // 🔍 CRITICAL: Auto-resolve supervisorPositionId if primaryPositionId is being updated
    let supervisorPositionId: Types.ObjectId | undefined = undefined;
    if (updateDto.primaryPositionId) {
      console.log("👤 Updating employee primaryPositionId:", updateDto.primaryPositionId);
      console.log("📌 Employee primaryPositionId:", updateDto.primaryPositionId);
      supervisorPositionId = await this.resolveSupervisorPositionId(updateDto.primaryPositionId);
      if (supervisorPositionId) {
        console.log("✅ supervisorPositionId set:", supervisorPositionId);
      }
    }

    const updated = await this.employeeProfileModel.findByIdAndUpdate(
      employeeId,
      {
        ...updateDto,
        ...(supervisorPositionId && { supervisorPositionId }),
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
