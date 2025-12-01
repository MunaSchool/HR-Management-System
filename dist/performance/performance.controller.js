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
exports.PerformanceController = void 0;
const common_1 = require("@nestjs/common");
const performance_service_1 = require("./performance.service");
const create_appraisal_template_dto_1 = require("./dto/create-appraisal-template.dto");
const create_appraisal_cycle_dto_1 = require("./dto/create-appraisal-cycle.dto");
const create_appraisal_record_dto_1 = require("./dto/create-appraisal-record.dto");
const create_appraisal_dispute_dto_1 = require("./dto/create-appraisal-dispute.dto");
const update_appraisal_dispute_dto_1 = require("./dto/update-appraisal-dispute.dto");
const update_appraisal_cycle_status_dto_1 = require("./dto/update-appraisal-cycle-status.dto");
const publish_appraisal_record_dto_1 = require("./dto/publish-appraisal-record.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const employee_profile_enums_1 = require("../employee-profile/enums/employee-profile.enums");
let PerformanceController = class PerformanceController {
    performanceService;
    constructor(performanceService) {
        this.performanceService = performanceService;
    }
    async createAppraisalTemplate(createTemplateDto) {
        return this.performanceService.createAppraisalTemplate(createTemplateDto);
    }
    async getAllAppraisalTemplates() {
        return this.performanceService.getAllAppraisalTemplates();
    }
    async getAppraisalTemplateById(id) {
        return this.performanceService.getAppraisalTemplateById(id);
    }
    async updateAppraisalTemplate(id, updateTemplateDto) {
        return this.performanceService.updateAppraisalTemplate(id, updateTemplateDto);
    }
    async createAppraisalCycle(createCycleDto) {
        return this.performanceService.createAppraisalCycle(createCycleDto);
    }
    async getAllAppraisalCycles() {
        return this.performanceService.getAllAppraisalCycles();
    }
    async getAppraisalCycleById(id) {
        return this.performanceService.getAppraisalCycleById(id);
    }
    async updateAppraisalCycleStatus(id, updateStatusDto) {
        return this.performanceService.updateAppraisalCycleStatus(id, updateStatusDto.status);
    }
    async createAppraisalAssignments(cycleId) {
        return this.performanceService.createAppraisalAssignments(cycleId);
    }
    async getEmployeeAppraisals(employeeProfileId, user) {
        return this.performanceService.getEmployeeAppraisals(employeeProfileId);
    }
    async getManagerAppraisalAssignments(managerProfileId) {
        return this.performanceService.getManagerAppraisalAssignments(managerProfileId);
    }
    async createOrUpdateAppraisalRecord(assignmentId, createRecordDto) {
        return this.performanceService.createOrUpdateAppraisalRecord(assignmentId, createRecordDto);
    }
    async submitAppraisalRecord(assignmentId) {
        return this.performanceService.submitAppraisalRecord(assignmentId);
    }
    async publishAppraisalRecord(assignmentId, publishDto) {
        return this.performanceService.publishAppraisalRecord(assignmentId, publishDto.publishedByEmployeeId);
    }
    async createAppraisalDispute(createDisputeDto, user) {
        return this.performanceService.createAppraisalDispute(createDisputeDto);
    }
    async getAppraisalDisputes(cycleId) {
        return this.performanceService.getAppraisalDisputes(cycleId);
    }
    async updateDisputeStatus(disputeId, updateDisputeDto) {
        return this.performanceService.updateDisputeStatus(disputeId, updateDisputeDto.status, {
            resolvedByEmployeeId: updateDisputeDto.resolvedByEmployeeId,
            resolutionSummary: updateDisputeDto.resolutionSummary
        });
    }
    async getCycleAssignments(cycleId) {
        return this.performanceService.getAppraisalAssignmentsByCycle(cycleId);
    }
    async getAppraisalAssignment(assignmentId, user) {
        return this.performanceService.getAppraisalAssignmentById(assignmentId);
    }
    async getAppraisalRecord(recordId, user) {
        return this.performanceService.getAppraisalRecordById(recordId);
    }
    async getAppraisalDispute(disputeId) {
        return this.performanceService.getAppraisalDisputeById(disputeId);
    }
    async updateAssignmentStatus(assignmentId, status) {
        return this.performanceService.updateAppraisalAssignmentStatus(assignmentId, status);
    }
    async updateRecordStatus(recordId, status) {
        return this.performanceService.updateAppraisalRecordStatus(recordId, status);
    }
    async assignDisputeReviewer(disputeId, reviewerId) {
        return this.performanceService.assignDisputeReviewer(disputeId, reviewerId);
    }
    async getPerformanceAnalytics(cycleId) {
        return this.performanceService.getPerformanceAnalytics(cycleId);
    }
    async getDepartmentPerformanceAnalytics(departmentId, cycleId) {
        return this.performanceService.getDepartmentPerformanceAnalytics(departmentId, cycleId);
    }
    async getHistoricalTrendAnalysis(employeeProfileId) {
        return this.performanceService.getHistoricalTrendAnalysis(employeeProfileId);
    }
    async exportPerformanceReport(cycleId) {
        return this.performanceService.exportPerformanceReport(cycleId);
    }
};
exports.PerformanceController = PerformanceController;
__decorate([
    (0, common_1.Post)('templates'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appraisal_template_dto_1.CreateAppraisalTemplateDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createAppraisalTemplate", null);
__decorate([
    (0, common_1.Get)('templates'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAllAppraisalTemplates", null);
__decorate([
    (0, common_1.Get)('templates/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalTemplateById", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_appraisal_template_dto_1.CreateAppraisalTemplateDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateAppraisalTemplate", null);
__decorate([
    (0, common_1.Post)('cycles'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appraisal_cycle_dto_1.CreateAppraisalCycleDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createAppraisalCycle", null);
__decorate([
    (0, common_1.Get)('cycles'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAllAppraisalCycles", null);
__decorate([
    (0, common_1.Get)('cycles/:id'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalCycleById", null);
__decorate([
    (0, common_1.Put)('cycles/:id/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appraisal_cycle_status_dto_1.UpdateAppraisalCycleStatusDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateAppraisalCycleStatus", null);
__decorate([
    (0, common_1.Post)('cycles/:cycleId/assignments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createAppraisalAssignments", null);
__decorate([
    (0, common_1.Get)('employees/:employeeProfileId/appraisals'),
    __param(0, (0, common_1.Param)('employeeProfileId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getEmployeeAppraisals", null);
__decorate([
    (0, common_1.Get)('managers/:managerProfileId/assignments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('managerProfileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getManagerAppraisalAssignments", null);
__decorate([
    (0, common_1.Post)('assignments/:assignmentId/record'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_appraisal_record_dto_1.CreateAppraisalRecordDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createOrUpdateAppraisalRecord", null);
__decorate([
    (0, common_1.Put)('assignments/:assignmentId/submit'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD, employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "submitAppraisalRecord", null);
__decorate([
    (0, common_1.Put)('assignments/:assignmentId/publish'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, publish_appraisal_record_dto_1.PublishAppraisalRecordDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "publishAppraisalRecord", null);
__decorate([
    (0, common_1.Post)('disputes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appraisal_dispute_dto_1.CreateAppraisalDisputeDto, Object]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "createAppraisalDispute", null);
__decorate([
    (0, common_1.Get)('disputes'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalDisputes", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appraisal_dispute_dto_1.UpdateAppraisalDisputeDto]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateDisputeStatus", null);
__decorate([
    (0, common_1.Get)('cycles/:cycleId/assignments'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getCycleAssignments", null);
__decorate([
    (0, common_1.Get)('assignments/:assignmentId'),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalAssignment", null);
__decorate([
    (0, common_1.Get)('records/:recordId'),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalRecord", null);
__decorate([
    (0, common_1.Get)('disputes/:disputeId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getAppraisalDispute", null);
__decorate([
    (0, common_1.Put)('assignments/:assignmentId/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('assignmentId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateAssignmentStatus", null);
__decorate([
    (0, common_1.Put)('records/:recordId/status'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('recordId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "updateRecordStatus", null);
__decorate([
    (0, common_1.Put)('disputes/:disputeId/assign-reviewer'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Param)('disputeId')),
    __param(1, (0, common_1.Body)('reviewerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "assignDisputeReviewer", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getPerformanceAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/department/:departmentId'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Param)('departmentId')),
    __param(1, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getDepartmentPerformanceAnalytics", null);
__decorate([
    (0, common_1.Get)('analytics/trends'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN, employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD),
    __param(0, (0, common_1.Query)('employeeProfileId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "getHistoricalTrendAnalysis", null);
__decorate([
    (0, common_1.Get)('reports/export'),
    (0, roles_decorator_1.Roles)(employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN),
    __param(0, (0, common_1.Query)('cycleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformanceController.prototype, "exportPerformanceReport", null);
exports.PerformanceController = PerformanceController = __decorate([
    (0, common_1.Controller)('performance'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    __metadata("design:paramtypes", [performance_service_1.PerformanceService])
], PerformanceController);
//# sourceMappingURL=performance.controller.js.map