"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoleService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_system_role_schema_1 = require("../models/employee-system-role.schema");
const employee_profile_schema_1 = require("../models/employee-profile.schema");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
let EmployeeRoleService = class EmployeeRoleService {
    employeeRoleModel;
    employeeProfileModel;
    constructor(employeeRoleModel, employeeProfileModel) {
        this.employeeRoleModel = employeeRoleModel;
        this.employeeProfileModel = employeeProfileModel;
    }
    async resolveEmployeeId(employeeId) {
        if ((0, mongoose_2.isValidObjectId)(employeeId)) {
            return employeeId;
        }
        const employee = await this.employeeProfileModel.findOne({
            employeeNumber: employeeId,
        });
        if (!employee) {
            throw new common_1.BadRequestException(`Invalid employee identifier: ${employeeId}`);
        }
        return employee._id.toString();
    }
    async assignRolesToEmployee(employeeId, assignRoleDto, assignedBy, assignerRole) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(assignerRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions to assign roles');
        }
        const resolvedId = await this.resolveEmployeeId(employeeId);
        const employee = await this.employeeProfileModel.findById(resolvedId);
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        let roleAssignment = await this.employeeRoleModel.findOne({
            employeeProfileId: resolvedId,
        });
        if (roleAssignment) {
            roleAssignment.roles = assignRoleDto.roles;
            roleAssignment.permissions = assignRoleDto.permissions || [];
            roleAssignment.isActive =
                assignRoleDto.isActive ?? true;
            await roleAssignment.save();
        }
        else {
            roleAssignment = new this.employeeRoleModel({
                employeeProfileId: resolvedId,
                roles: assignRoleDto.roles,
                permissions: assignRoleDto.permissions || [],
                isActive: assignRoleDto.isActive ?? true,
            });
            await roleAssignment.save();
            await this.employeeProfileModel.findByIdAndUpdate(resolvedId, {
                accessProfileId: roleAssignment._id,
            });
        }
        return roleAssignment;
    }
    async getEmployeeRoles(employeeId) {
        const resolvedId = await this.resolveEmployeeId(employeeId);
        const roleAssignment = await this.employeeRoleModel
            .findOne({
            $or: [
                { employeeProfileId: resolvedId },
                { employeeProfileId: new mongoose_2.Types.ObjectId(resolvedId) }
            ]
        })
            .populate('employeeProfileId');
        if (!roleAssignment) {
            throw new common_1.NotFoundException('No role assignment found for this employee');
        }
        return roleAssignment;
    }
    async getEmployeesByRole(role) {
        return this.employeeRoleModel
            .find({ roles: role, isActive: true })
            .populate('employeeProfileId')
            .exec();
    }
    async removeRolesFromEmployee(employeeId, removedBy, removerRole) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(removerRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        const resolvedId = await this.resolveEmployeeId(employeeId);
        const roleAssignment = await this.employeeRoleModel.findOne({
            employeeProfileId: resolvedId,
        });
        if (!roleAssignment) {
            throw new common_1.NotFoundException('Role assignment not found');
        }
        roleAssignment.isActive = false;
        await roleAssignment.save();
        return roleAssignment;
    }
    async addPermissionToEmployee(employeeId, permission, assignedBy, assignerRole) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(assignerRole)) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        const resolvedId = await this.resolveEmployeeId(employeeId);
        const roleAssignment = await this.employeeRoleModel.findOne({
            employeeProfileId: resolvedId,
        });
        if (!roleAssignment) {
            throw new common_1.NotFoundException('Role assignment not found');
        }
        if (roleAssignment.permissions.includes(permission)) {
            throw new common_1.ConflictException('Permission already exists');
        }
        roleAssignment.permissions.push(permission);
        await roleAssignment.save();
        return roleAssignment;
    }
    async removePermissionFromEmployee(employeeId, permission, removedBy, removerRole) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(removerRole)) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        const resolvedId = await this.resolveEmployeeId(employeeId);
        const roleAssignment = await this.employeeRoleModel.findOne({
            employeeProfileId: resolvedId,
        });
        if (!roleAssignment) {
            throw new common_1.NotFoundException('Role assignment not found');
        }
        roleAssignment.permissions = roleAssignment.permissions.filter((p) => p !== permission);
        await roleAssignment.save();
        return roleAssignment;
    }
    async getAllRoleAssignments(userRole) {
        if (![
            employee_profile_enums_1.SystemRole.HR_ADMIN,
            employee_profile_enums_1.SystemRole.HR_MANAGER,
            employee_profile_enums_1.SystemRole.SYSTEM_ADMIN,
        ].includes(userRole)) {
            throw new common_1.ForbiddenException('Not allowed');
        }
        return this.employeeRoleModel
            .find()
            .populate('employeeProfileId')
            .exec();
    }
};
exports.EmployeeRoleService = EmployeeRoleService;
exports.EmployeeRoleService = EmployeeRoleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __param(1, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EmployeeRoleService);
//# sourceMappingURL=employee-role.service.js.map