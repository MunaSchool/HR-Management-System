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
exports.EmployeeProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const employee_profile_service_1 = require("./employee-profile.service");
const employee_role_service_1 = require("./services/employee-role.service");
const candidate_registration_service_1 = require("./services/candidate-registration.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const employee_profile_enums_1 = require("./enums/employee-profile.enums");
const update_contact_info_dto_1 = require("./dto/update-contact-info.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const create_change_request_dto_1 = require("./dto/create-change-request.dto");
const process_change_request_dto_1 = require("./dto/process-change-request.dto");
const update_employee_master_dto_1 = require("./dto/update-employee-master.dto");
const assign_role_dto_1 = require("./dto/assign-role.dto");
let EmployeeProfileController = class EmployeeProfileController {
    employeeProfileService;
    employeeRoleService;
    candidateRegistrationService;
    constructor(employeeProfileService, employeeRoleService, candidateRegistrationService) {
        this.employeeProfileService = employeeProfileService;
        this.employeeRoleService = employeeRoleService;
        this.candidateRegistrationService = candidateRegistrationService;
    }
    async registerCandidate(registerDto) {
        return this.candidateRegistrationService.registerCandidate(registerDto);
    }
    async getCandidateProfile(user) {
        return this.candidateRegistrationService.getCandidateProfile(user.employeeId);
    }
    async updateCandidateProfile(user, updateDto) {
        return this.candidateRegistrationService.updateCandidateProfile(user.employeeId, updateDto);
    }
    async changeCandidatePassword(user, passwordDto) {
        return this.candidateRegistrationService.changePassword(user.employeeId, passwordDto.currentPassword, passwordDto.newPassword);
    }
    async getAllEmployees() {
        return this.employeeProfileService.findAll();
    }
    async searchEmployees(searchQuery, status, departmentId) {
        return this.employeeProfileService.searchEmployees(searchQuery || '', status, departmentId);
    }
    async getMyProfile(user) {
        return this.employeeProfileService.getMyProfile(user.employeeId);
    }
    async updateMyContactInfo(user, updateDto) {
        return this.employeeProfileService.updateMyContactInfo(user.employeeId, user.userId, updateDto);
    }
    async updateMyProfile(user, updateDto) {
        return this.employeeProfileService.updateMyProfile(user.employeeId, user.userId, updateDto);
    }
    async createChangeRequest(user, createDto) {
        return this.employeeProfileService.createChangeRequest(user.employeeId, user.userId, createDto);
    }
    async getMyChangeRequests(user) {
        return this.employeeProfileService.getMyChangeRequests(user.employeeId);
    }
    async uploadProfilePicture(user, file) {
        const fileUrl = await this.employeeProfileService.saveFile(file, user.employeeId);
        const profile = await this.employeeProfileService.getMyProfile(user.employeeId);
        if (profile.profilePictureUrl) {
            await this.employeeProfileService.deleteFile(profile.profilePictureUrl);
        }
        await this.employeeProfileService.updateMyProfile(user.employeeId, user.userId, {
            profilePictureUrl: fileUrl,
        });
        return { message: 'Profile picture uploaded successfully', url: fileUrl };
    }
    async getTeamMembers(user) {
        const managerPositionId = user['managerPositionId'] || user.employeeId;
        return this.employeeProfileService.getTeamMembers(managerPositionId);
    }
    async getTeamMemberProfile(user, id) {
        const managerPositionId = user['managerPositionId'] || user.employeeId;
        return this.employeeProfileService.getTeamMemberProfile(id, managerPositionId);
    }
    async getPendingChangeRequests() {
        return this.employeeProfileService.getPendingChangeRequests();
    }
    async getChangeRequestById(requestId) {
        return this.employeeProfileService.getChangeRequestById(requestId);
    }
    async processChangeRequest(user, requestId, processDto) {
        return this.employeeProfileService.processChangeRequest(requestId, user.userId, user.roles?.[0] || '', processDto);
    }
    async getEmployeesByRole(role) {
        return await this.employeeRoleService.getEmployeesByRole(role);
    }
    async getAllRoleAssignments(user) {
        return await this.employeeRoleService.getAllRoleAssignments(user.roles?.[0] || '');
    }
    async getProfilePicture(filename, res) {
        const file = await this.employeeProfileService.getFile(filename);
        res.send(file);
    }
    async getEmployeeById(id) {
        return this.employeeProfileService.findById(id);
    }
    async getEmployeeRoles(id) {
        return await this.employeeRoleService.getEmployeeRoles(id);
    }
    async assignRoles(user, id, assignRoleDto) {
        return await this.employeeRoleService.assignRolesToEmployee(id, assignRoleDto, user.userId, user.roles?.[0] || '');
    }
    async removeRoles(user, id) {
        return await this.employeeRoleService.removeRolesFromEmployee(id, user.userId, user.roles?.[0] || '');
    }
    async addPermission(user, id, permission) {
        return await this.employeeRoleService.addPermissionToEmployee(id, permission, user.userId, user.roles?.[0] || '');
    }
    async removePermission(user, id, permission) {
        return await this.employeeRoleService.removePermissionFromEmployee(id, permission, user.userId, user.roles?.[0] || '');
    }
    async updateEmployeeStatus(user, id, statusDto) {
        return this.employeeProfileService.deactivateEmployee(id, user.userId, user.roles?.[0] || '', statusDto.status, statusDto.effectiveDate);
    }
    async updateEmployeeMasterData(user, id, updateDto) {
        return this.employeeProfileService.updateEmployeeMasterData(id, user.userId, user.roles?.[0] || '', updateDto);
    }
    async deleteEmployee(id) {
        return this.employeeProfileService.delete(id);
    }
};
exports.EmployeeProfileController = EmployeeProfileController;
__decorate([
    (0, common_1.Post)('candidate/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "registerCandidate", null);
__decorate([
    (0, common_1.Get)('candidate/profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getCandidateProfile", null);
__decorate([
    (0, common_1.Put)('candidate/profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "updateCandidateProfile", null);
__decorate([
    (0, common_1.Put)('candidate/change-password'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "changeCandidatePassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getAllEmployees", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "searchEmployees", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me/contact-info'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_contact_info_dto_1.UpdateContactInfoDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "updateMyContactInfo", null);
__decorate([
    (0, common_1.Patch)('me/profile'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Post)('me/change-requests'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_change_request_dto_1.CreateChangeRequestDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "createChangeRequest", null);
__decorate([
    (0, common_1.Get)('me/change-requests'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getMyChangeRequests", null);
__decorate([
    (0, common_1.Post)('me/profile-picture'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)('team'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getTeamMembers", null);
__decorate([
    (0, common_1.Get)('team/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getTeamMemberProfile", null);
__decorate([
    (0, common_1.Get)('change-requests/pending'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getPendingChangeRequests", null);
__decorate([
    (0, common_1.Get)('change-requests/:requestId'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getChangeRequestById", null);
__decorate([
    (0, common_1.Patch)('change-requests/:requestId/process'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('requestId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, process_change_request_dto_1.ProcessChangeRequestDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "processChangeRequest", null);
__decorate([
    (0, common_1.Get)('roles/by-role/:role'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getEmployeesByRole", null);
__decorate([
    (0, common_1.Get)('roles/all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getAllRoleAssignments", null);
__decorate([
    (0, common_1.Get)('profile-picture/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getProfilePicture", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getEmployeeById", null);
__decorate([
    (0, common_1.Get)(':id/roles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "getEmployeeRoles", null);
__decorate([
    (0, common_1.Post)(':id/roles/assign'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, assign_role_dto_1.AssignRoleDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "assignRoles", null);
__decorate([
    (0, common_1.Delete)(':id/roles/remove'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "removeRoles", null);
__decorate([
    (0, common_1.Patch)(':id/permissions/add'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('permission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "addPermission", null);
__decorate([
    (0, common_1.Patch)(':id/permissions/remove'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('permission')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "removePermission", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "updateEmployeeStatus", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_employee_master_dto_1.UpdateEmployeeMasterDto]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "updateEmployeeMasterData", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeProfileController.prototype, "deleteEmployee", null);
exports.EmployeeProfileController = EmployeeProfileController = __decorate([
    (0, common_1.Controller)('employee-profile'),
    __metadata("design:paramtypes", [employee_profile_service_1.EmployeeProfileService,
        employee_role_service_1.EmployeeRoleService,
        candidate_registration_service_1.CandidateRegistrationService])
], EmployeeProfileController);
//# sourceMappingURL=employee-profile.controller.js.map