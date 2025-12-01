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
exports.OrganizationStructureController = void 0;
const common_1 = require("@nestjs/common");
const organization_structure_service_1 = require("./organization-structure.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
const create_department_dto_1 = require("./dtos/create-department.dto");
const update_department_dto_1 = require("./dtos/update-department.dto");
let OrganizationStructureController = class OrganizationStructureController {
    organizationStructureService;
    constructor(organizationStructureService) {
        this.organizationStructureService = organizationStructureService;
    }
    createDepartment(dto) {
        return this.organizationStructureService.createDepartment(dto);
    }
    getAllDepartments(includeInactive) {
        const showInactive = includeInactive === 'true';
        return this.organizationStructureService.getAllDepartments(showInactive);
    }
    getDepartmentById(id) {
        return this.organizationStructureService.getDepartmentById(id);
    }
    updateDepartment(id, dto) {
        return this.organizationStructureService.updateDepartment(id, dto);
    }
    deactivateDepartment(id) {
        return this.organizationStructureService.deactivateDepartment(id);
    }
    createPosition(dto) {
        return this.organizationStructureService.createPosition(dto);
    }
    getAllPositions() {
        return this.organizationStructureService.getAllPositions();
    }
    getPositionById(id) {
        return this.organizationStructureService.getPositionById(id);
    }
    updatePosition(id, dto) {
        return this.organizationStructureService.updatePosition(id, dto);
    }
    updateReportingLine(id, dto) {
        return this.organizationStructureService.updateReportingLine(id, dto);
    }
    movePosition(id, dto) {
        return this.organizationStructureService.movePosition(id, dto);
    }
    delimitPosition(id, dto) {
        return this.organizationStructureService.delimitPosition(id, dto);
    }
    submitChangeRequest(dto, user) {
        return this.organizationStructureService.submitChangeRequest(dto, user.employeeId);
    }
    getAllChangeRequests() {
        return this.organizationStructureService.getAllChangeRequests();
    }
    getChangeRequestById(id) {
        return this.organizationStructureService.getChangeRequestById(id);
    }
    approveChangeRequest(id, user) {
        return this.organizationStructureService.approveChangeRequest(id, user.employeeId);
    }
    rejectChangeRequest(id, dto, user) {
        return this.organizationStructureService.rejectChangeRequest(id, dto.reason, user.employeeId);
    }
    getOrganizationHierarchy() {
        return this.organizationStructureService.getOrganizationHierarchy();
    }
    getDepartmentHierarchy(departmentId) {
        return this.organizationStructureService.getDepartmentHierarchy(departmentId);
    }
    getMyTeamHierarchy(user) {
        return this.organizationStructureService.getMyTeamHierarchy(user.employeeId);
    }
    getMyStructure(user) {
        return this.organizationStructureService.getMyStructure(user.employeeId);
    }
};
exports.OrganizationStructureController = OrganizationStructureController;
__decorate([
    (0, common_1.Post)('departments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_department_dto_1.CreateDepartmentDto]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getAllDepartments", null);
__decorate([
    (0, common_1.Get)('departments/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getDepartmentById", null);
__decorate([
    (0, common_1.Put)('departments/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_department_dto_1.UpdateDepartmentDto]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Patch)('departments/:id/deactivate'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "deactivateDepartment", null);
__decorate([
    (0, common_1.Post)('positions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "createPosition", null);
__decorate([
    (0, common_1.Get)('positions'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getAllPositions", null);
__decorate([
    (0, common_1.Get)('positions/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getPositionById", null);
__decorate([
    (0, common_1.Put)('positions/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "updatePosition", null);
__decorate([
    (0, common_1.Put)('positions/:id/reporting-line'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "updateReportingLine", null);
__decorate([
    (0, common_1.Put)('positions/:id/move'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "movePosition", null);
__decorate([
    (0, common_1.Patch)('positions/:id/delimit'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "delimitPosition", null);
__decorate([
    (0, common_1.Post)('change-requests'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "submitChangeRequest", null);
__decorate([
    (0, common_1.Get)('change-requests'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getAllChangeRequests", null);
__decorate([
    (0, common_1.Get)('change-requests/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getChangeRequestById", null);
__decorate([
    (0, common_1.Put)('change-requests/:id/approve'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "approveChangeRequest", null);
__decorate([
    (0, common_1.Put)('change-requests/:id/reject'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "rejectChangeRequest", null);
__decorate([
    (0, common_1.Get)('hierarchy/organization'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getOrganizationHierarchy", null);
__decorate([
    (0, common_1.Get)('hierarchy/department/:departmentId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('departmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getDepartmentHierarchy", null);
__decorate([
    (0, common_1.Get)('hierarchy/my-team'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getMyTeamHierarchy", null);
__decorate([
    (0, common_1.Get)('hierarchy/my-structure'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], OrganizationStructureController.prototype, "getMyStructure", null);
exports.OrganizationStructureController = OrganizationStructureController = __decorate([
    (0, common_1.Controller)('organization-structure'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [organization_structure_service_1.OrganizationStructureService])
], OrganizationStructureController);
//# sourceMappingURL=organization-structure.controller.js.map