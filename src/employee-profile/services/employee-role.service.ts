import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  EmployeeSystemRole,
  EmployeeSystemRoleDocument,
} from '../models/employee-system-role.schema';
import { EmployeeProfile } from '../models/employee-profile.schema';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { SystemRole } from '../enums/employee-profile.enums';

@Injectable()
export class EmployeeRoleService {
  constructor(
    @InjectModel(EmployeeSystemRole.name)
    private employeeRoleModel: Model<EmployeeSystemRoleDocument>,
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfile>,
  ) {}

  // ==================== ROLE MANAGEMENT OPERATIONS ====================

  // Assign roles to an employee (US-E7-05)
  async assignRolesToEmployee(
    employeeId: string,
    assignRoleDto: AssignRoleDto,
    assignedBy: string,
    assignerRole: string,
  ): Promise<EmployeeSystemRoleDocument> {
    // Verify user has permission - Only HR Admin and System Admin can assign roles
    if (
      ![SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN].includes(
        assignerRole as SystemRole,
      )
    ) {
      throw new ForbiddenException('Insufficient permissions to assign roles');
    }

    // Verify employee exists
    const employee = await this.employeeProfileModel.findById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if employee already has role assignment
    let roleAssignment = await this.employeeRoleModel.findOne({
      employeeProfileId: new Types.ObjectId(employeeId),
    });

    if (roleAssignment) {
      // Update existing role assignment
      roleAssignment.roles = assignRoleDto.roles;
      roleAssignment.permissions = assignRoleDto.permissions || [];
      roleAssignment.isActive =
        assignRoleDto.isActive !== undefined ? assignRoleDto.isActive : true;
      await roleAssignment.save();
    } else {
      // Create new role assignment
      roleAssignment = new this.employeeRoleModel({
        employeeProfileId: new Types.ObjectId(employeeId),
        roles: assignRoleDto.roles,
        permissions: assignRoleDto.permissions || [],
        isActive:
          assignRoleDto.isActive !== undefined ? assignRoleDto.isActive : true,
      });
      await roleAssignment.save();

      // Update employee profile with accessProfileId
      await this.employeeProfileModel.findByIdAndUpdate(employeeId, {
        accessProfileId: roleAssignment._id,
      });
    }

    return roleAssignment;
  }

  // Get employee's roles and permissions
  async getEmployeeRoles(
    employeeId: string,
  ): Promise<EmployeeSystemRoleDocument> {
    const roleAssignment = await this.employeeRoleModel
      .findOne({ employeeProfileId: new Types.ObjectId(employeeId) })
      .populate('employeeProfileId');

    if (!roleAssignment) {
      throw new NotFoundException('No role assignment found for this employee');
    }

    return roleAssignment;
  }

  // Get all employees with specific role
  async getEmployeesByRole(role: SystemRole): Promise<EmployeeSystemRoleDocument[]> {
    return await this.employeeRoleModel
      .find({ roles: role, isActive: true })
      .populate('employeeProfileId')
      .exec();
  }

  // Remove roles from employee
  async removeRolesFromEmployee(
    employeeId: string,
    removedBy: string,
    removerRole: string,
  ): Promise<EmployeeSystemRoleDocument> {
    // Verify user has permission
    if (
      ![SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN].includes(
        removerRole as SystemRole,
      )
    ) {
      throw new ForbiddenException('Insufficient permissions to remove roles');
    }

    const roleAssignment = await this.employeeRoleModel.findOne({
      employeeProfileId: new Types.ObjectId(employeeId),
    });

    if (!roleAssignment) {
      throw new NotFoundException('No role assignment found for this employee');
    }

    // Deactivate instead of delete
    roleAssignment.isActive = false;
    await roleAssignment.save();

    return roleAssignment;
  }

  // Add permission to employee
  async addPermissionToEmployee(
    employeeId: string,
    permission: string,
    assignedBy: string,
    assignerRole: string,
  ): Promise<EmployeeSystemRoleDocument> {
    // Verify user has permission
    if (
      ![SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN].includes(
        assignerRole as SystemRole,
      )
    ) {
      throw new ForbiddenException('Insufficient permissions to add permissions');
    }

    const roleAssignment = await this.employeeRoleModel.findOne({
      employeeProfileId: new Types.ObjectId(employeeId),
    });

    if (!roleAssignment) {
      throw new NotFoundException('No role assignment found for this employee');
    }

    if (roleAssignment.permissions.includes(permission)) {
      throw new ConflictException('Permission already assigned');
    }

    roleAssignment.permissions.push(permission);
    await roleAssignment.save();

    return roleAssignment;
  }

  // Remove permission from employee
  async removePermissionFromEmployee(
    employeeId: string,
    permission: string,
    removedBy: string,
    removerRole: string,
  ): Promise<EmployeeSystemRoleDocument> {
    // Verify user has permission
    if (
      ![SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN].includes(
        removerRole as SystemRole,
      )
    ) {
      throw new ForbiddenException('Insufficient permissions to remove permissions');
    }

    const roleAssignment = await this.employeeRoleModel.findOne({
      employeeProfileId: new Types.ObjectId(employeeId),
    });

    if (!roleAssignment) {
      throw new NotFoundException('No role assignment found for this employee');
    }

    roleAssignment.permissions = roleAssignment.permissions.filter(
      (p) => p !== permission,
    );
    await roleAssignment.save();

    return roleAssignment;
  }

  // Get all role assignments (for admin view)
  async getAllRoleAssignments(
    userRole: string,
  ): Promise<EmployeeSystemRoleDocument[]> {
    // Verify user has permission
    if (
      ![SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN].includes(
        userRole as SystemRole,
      )
    ) {
      throw new ForbiddenException('Insufficient permissions to view role assignments');
    }

    return await this.employeeRoleModel
      .find()
      .populate('employeeProfileId')
      .exec();
  }
}
