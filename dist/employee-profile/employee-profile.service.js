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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProfileService = void 0;
const common_1 = require("@nestjs/common");
const employee_crud_service_1 = require("./services/employee-crud.service");
const employee_self_service_service_1 = require("./services/employee-self-service.service");
const change_request_service_1 = require("./services/change-request.service");
const file_upload_service_1 = require("./services/file-upload.service");
const hr_admin_service_1 = require("./services/hr-admin.service");
let EmployeeProfileService = class EmployeeProfileService {
    employeeCrudService;
    employeeSelfServiceService;
    changeRequestService;
    fileUploadService;
    hrAdminService;
    constructor(employeeCrudService, employeeSelfServiceService, changeRequestService, fileUploadService, hrAdminService) {
        this.employeeCrudService = employeeCrudService;
        this.employeeSelfServiceService = employeeSelfServiceService;
        this.changeRequestService = changeRequestService;
        this.fileUploadService = fileUploadService;
        this.hrAdminService = hrAdminService;
    }
    async create(employeeData) {
        return this.employeeCrudService.create(employeeData);
    }
    async findAll() {
        return this.employeeCrudService.findAll();
    }
    async findById(id) {
        return this.employeeCrudService.findById(id);
    }
    async update(id, updateData) {
        return this.employeeCrudService.update(id, updateData);
    }
    async delete(id) {
        return this.employeeCrudService.delete(id);
    }
    async getMyProfile(employeeId) {
        return this.employeeSelfServiceService.getMyProfile(employeeId);
    }
    async updateMyContactInfo(employeeId, userId, updateDto) {
        return this.employeeSelfServiceService.updateMyContactInfo(employeeId, userId, updateDto);
    }
    async updateMyProfile(employeeId, userId, updateDto) {
        return this.employeeSelfServiceService.updateMyProfile(employeeId, userId, updateDto);
    }
    async getTeamMembers(managerPositionId) {
        return this.employeeSelfServiceService.getTeamMembers(managerPositionId);
    }
    async getTeamMemberProfile(employeeId, managerPositionId) {
        return this.employeeSelfServiceService.getTeamMemberProfile(employeeId, managerPositionId);
    }
    async createChangeRequest(employeeId, userId, createDto) {
        return this.changeRequestService.createChangeRequest(employeeId, userId, createDto);
    }
    async getMyChangeRequests(employeeId) {
        return this.changeRequestService.getMyChangeRequests(employeeId);
    }
    async getPendingChangeRequests() {
        return this.changeRequestService.getPendingChangeRequests();
    }
    async getChangeRequestById(requestId) {
        return this.changeRequestService.getChangeRequestById(requestId);
    }
    async processChangeRequest(requestId, userId, userRole, processDto) {
        return this.changeRequestService.processChangeRequest(requestId, userId, userRole, processDto);
    }
    async saveFile(file, employeeId) {
        return this.fileUploadService.saveFile(file, employeeId);
    }
    async getFile(filename) {
        return this.fileUploadService.getFile(filename);
    }
    async deleteFile(filename) {
        return this.fileUploadService.deleteFile(filename);
    }
    async searchEmployees(searchQuery, status, departmentId) {
        return this.hrAdminService.searchEmployees(searchQuery, status, departmentId);
    }
    async updateEmployeeMasterData(employeeId, userId, userRole, updateDto) {
        return this.hrAdminService.updateEmployeeMasterData(employeeId, userId, userRole, updateDto);
    }
    async deactivateEmployee(employeeId, userId, userRole, status, effectiveDate) {
        return this.hrAdminService.deactivateEmployee(employeeId, userId, userRole, status, effectiveDate);
    }
};
exports.EmployeeProfileService = EmployeeProfileService;
exports.EmployeeProfileService = EmployeeProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_crud_service_1.EmployeeCrudService,
        employee_self_service_service_1.EmployeeSelfServiceService,
        change_request_service_1.ChangeRequestService,
        file_upload_service_1.FileUploadService,
        hr_admin_service_1.HrAdminService])
], EmployeeProfileService);
//# sourceMappingURL=employee-profile.service.js.map