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
exports.OrganizationStructureService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const department_schema_1 = require("./models/department.schema");
const position_schema_1 = require("./models/position.schema");
const structure_change_request_schema_1 = require("./models/structure-change-request.schema");
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const notification_log_service_1 = require("../time-management/services/notification-log.service");
let OrganizationStructureService = class OrganizationStructureService {
    departmentModel;
    positionModel;
    changeRequestModel;
    employeeProfileModel;
    notificationLogService;
    constructor(departmentModel, positionModel, changeRequestModel, employeeProfileModel, notificationLogService) {
        this.departmentModel = departmentModel;
        this.positionModel = positionModel;
        this.changeRequestModel = changeRequestModel;
        this.employeeProfileModel = employeeProfileModel;
        this.notificationLogService = notificationLogService;
        this.positionModel.schema.pre('save', function (next) {
            const doc = this;
            doc.reportsToPositionId = undefined;
            next();
        });
        this.positionModel.schema.pre('findOneAndUpdate', function (next) {
            const query = this;
            const update = query.getUpdate() || {};
            if (!update.$set)
                update.$set = {};
            update.$set.reportsToPositionId = undefined;
            query.setUpdate(update);
            next();
        });
    }
    async createDepartment(dto) {
        return this.departmentModel.create(dto);
    }
    async getDepartmentById(id) {
        const dept = await this.departmentModel.findById(id).exec();
        if (!dept)
            throw new common_1.NotFoundException("Department not found");
        return dept;
    }
    async getAllDepartments(showInactive = false) {
        if (showInactive) {
            return this.departmentModel.find().exec();
        }
        return this.departmentModel.find({ isActive: true }).exec();
    }
    async updateDepartment(id, dto) {
        const updated = await this.departmentModel.findByIdAndUpdate(id, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Department not found");
        return updated;
    }
    async deactivateDepartment(id) {
        const updated = await this.departmentModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Department not found");
        return updated;
    }
    async createPosition(dto) {
        const department = await this.departmentModel.findById(dto.departmentId);
        if (!department)
            throw new common_1.NotFoundException('Department not found');
        const pos = await this.positionModel.create({
            ...dto,
            reportsToPositionId: null
        });
        return pos;
    }
    async getAllPositions() {
        return this.positionModel.find().exec();
    }
    async getPositionById(id) {
        const pos = await this.positionModel.findById(id).exec();
        if (!pos)
            throw new common_1.NotFoundException("Position not found");
        return pos;
    }
    async updatePosition(id, dto) {
        const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Position not found");
        return updated;
    }
    async updateReportingLine(id, dto) {
        const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Position not found");
        return updated;
    }
    async movePosition(id, dto) {
        const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Position not found");
        return updated;
    }
    async deactivatePosition(id) {
        const updated = await this.positionModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Position not found");
        return updated;
    }
    async submitChangeRequest(dto, requestedBy) {
        const changeRequest = await this.changeRequestModel.create({
            ...dto,
            requestedByEmployeeId: new mongoose_2.Types.ObjectId(requestedBy),
            status: 'Pending',
            submittedAt: new Date(),
        });
        const systemAdmins = await this.employeeProfileModel.find({
            systemRoles: { $in: ['System Admin'] }
        }).exec();
        for (const admin of systemAdmins) {
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(admin._id.toString()),
                type: 'Structure Change Request Submitted',
                message: `A new organizational structure change request has been submitted. Please review and approve.`,
            });
        }
        return changeRequest;
    }
    async getAllChangeRequests() {
        return this.changeRequestModel.find().exec();
    }
    async getChangeRequestById(id) {
        const req = await this.changeRequestModel.findById(id).exec();
        if (!req)
            throw new common_1.NotFoundException("Change request not found");
        return req;
    }
    async delimitPosition(id, dto) {
        const position = await this.positionModel.findById(id).exec();
        if (!position)
            throw new common_1.NotFoundException("Position not found");
        const updated = await this.positionModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        return updated;
    }
    async approveChangeRequest(id, approvedBy) {
        const request = await this.changeRequestModel.findById(id).exec();
        if (!request)
            throw new common_1.NotFoundException("Change request not found");
        const updated = await this.changeRequestModel.findByIdAndUpdate(id, {
            status: 'Approved',
            approvedAt: new Date(),
        }, { new: true });
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(request.requestedByEmployeeId.toString()),
            type: 'Structure Change Request Approved',
            message: `Your organizational structure change request has been approved and applied.`,
        });
        return updated;
    }
    async rejectChangeRequest(id, reason, rejectedBy) {
        const request = await this.changeRequestModel.findById(id).exec();
        if (!request)
            throw new common_1.NotFoundException("Change request not found");
        const updated = await this.changeRequestModel.findByIdAndUpdate(id, {
            status: 'Rejected',
            rejectedAt: new Date(),
            rejectionReason: reason,
        }, { new: true });
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(request.requestedByEmployeeId.toString()),
            type: 'Structure Change Request Rejected',
            message: `Your organizational structure change request has been rejected. Reason: ${reason}`,
        });
        return updated;
    }
    async getOrganizationHierarchy() {
        const departments = await this.departmentModel.find({ isActive: true }).exec();
        const positions = await this.positionModel.find({ isActive: true })
            .populate('departmentId')
            .populate('reportsToPositionId')
            .exec();
        return {
            departments,
            positions,
        };
    }
    async getDepartmentHierarchy(departmentId) {
        const department = await this.departmentModel.findById(departmentId).exec();
        if (!department)
            throw new common_1.NotFoundException("Department not found");
        const positions = await this.positionModel.find({
            departmentId: new mongoose_2.Types.ObjectId(departmentId),
            isActive: true
        })
            .populate('reportsToPositionId')
            .exec();
        return {
            department,
            positions,
        };
    }
    async getMyTeamHierarchy(employeeId) {
        const employee = await this.employeeProfileModel.findById(employeeId).exec();
        if (!employee)
            throw new common_1.NotFoundException("Employee not found");
        const teamPositions = await this.positionModel.find({
            reportsToPositionId: employee.primaryPositionId,
            isActive: true,
        })
            .populate('departmentId')
            .exec();
        return {
            manager: employee,
            teamPositions,
        };
    }
    async getMyStructure(employeeId) {
        const employee = await this.employeeProfileModel.findById(employeeId)
            .populate('primaryPositionId')
            .populate('primaryDepartmentId')
            .exec();
        if (!employee)
            throw new common_1.NotFoundException("Employee not found");
        const position = await this.positionModel.findById(employee.primaryPositionId)
            .populate('reportsToPositionId')
            .populate('departmentId')
            .exec();
        return {
            employee,
            position,
            department: employee.primaryDepartmentId,
            reportsTo: position?.reportsToPositionId,
        };
    }
};
exports.OrganizationStructureService = OrganizationStructureService;
exports.OrganizationStructureService = OrganizationStructureService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __param(1, (0, mongoose_1.InjectModel)(position_schema_1.Position.name)),
    __param(2, (0, mongoose_1.InjectModel)(structure_change_request_schema_1.StructureChangeRequest.name)),
    __param(3, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_log_service_1.NotificationLogService])
], OrganizationStructureService);
//# sourceMappingURL=organization-structure.service.js.map