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
exports.ChangeRequestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_profile_schema_1 = require("../models/employee-profile.schema");
const ep_change_request_schema_1 = require("../models/ep-change-request.schema");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
const notification_log_service_1 = require("../../time-management/services/notification-log.service");
let ChangeRequestService = class ChangeRequestService {
    employeeProfileModel;
    changeRequestModel;
    notificationLogService;
    constructor(employeeProfileModel, changeRequestModel, notificationLogService) {
        this.employeeProfileModel = employeeProfileModel;
        this.changeRequestModel = changeRequestModel;
        this.notificationLogService = notificationLogService;
    }
    async createChangeRequest(employeeId, userId, createDto) {
        const requestId = `CR-${Date.now()}-${employeeId.slice(-6)}`;
        const changeFields = Object.keys(createDto.requestedChanges || {}).join(', ');
        const requestDescription = `Request to update: ${changeFields || 'profile data'}`;
        const newRequest = new this.changeRequestModel({
            requestId,
            requestDescription,
            employeeProfileId: employeeId,
            requestedBy: userId,
            requestedChanges: createDto.requestedChanges,
            reason: createDto.reason,
            status: employee_profile_enums_1.ProfileChangeStatus.PENDING,
            requestDate: new Date(),
        });
        const savedRequest = await newRequest.save();
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(employeeId),
            type: 'Profile Change Request Submitted',
            message: `A new profile change request has been submitted for review. Reason: ${createDto.reason}`,
        });
        return savedRequest;
    }
    async getMyChangeRequests(employeeId) {
        return await this.changeRequestModel
            .find({ employeeProfileId: employeeId })
            .sort({ requestDate: -1 })
            .exec();
    }
    async getPendingChangeRequests() {
        return await this.changeRequestModel
            .find({ status: employee_profile_enums_1.ProfileChangeStatus.PENDING })
            .populate('employeeProfileId')
            .populate('requestedBy')
            .sort({ requestDate: -1 })
            .exec();
    }
    async getChangeRequestById(requestId) {
        const request = await this.changeRequestModel
            .findById(requestId)
            .populate('employeeProfileId')
            .populate('requestedBy')
            .populate('reviewedBy')
            .exec();
        if (!request) {
            throw new common_1.NotFoundException('Change request not found');
        }
        return request;
    }
    async processChangeRequest(requestId, userId, userRole, processDto) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        const request = await this.changeRequestModel.findById(requestId);
        if (!request) {
            throw new common_1.NotFoundException('Change request not found');
        }
        if (request.status !== employee_profile_enums_1.ProfileChangeStatus.PENDING) {
            throw new common_1.BadRequestException('Request has already been processed');
        }
        request.status = processDto.approved
            ? employee_profile_enums_1.ProfileChangeStatus.APPROVED
            : employee_profile_enums_1.ProfileChangeStatus.REJECTED;
        request.reviewedBy = new mongoose_2.Types.ObjectId(userId);
        request.reviewDate = new Date();
        request.reviewComments = processDto.comments;
        if (processDto.approved) {
            await this.employeeProfileModel.findByIdAndUpdate(request.employeeProfileId, {
                ...request.requestedChanges,
                lastModifiedBy: userId,
                lastModifiedAt: new Date(),
            });
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(request.employeeProfileId.toString()),
                type: 'Profile Change Request Approved',
                message: `Your profile change request has been approved. ${processDto.comments || ''}`,
            });
        }
        else {
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(request.employeeProfileId.toString()),
                type: 'Profile Change Request Rejected',
                message: `Your profile change request has been rejected. ${processDto.comments || ''}`,
            });
        }
        return await request.save();
    }
};
exports.ChangeRequestService = ChangeRequestService;
exports.ChangeRequestService = ChangeRequestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(ep_change_request_schema_1.EmployeeProfileChangeRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notification_log_service_1.NotificationLogService])
], ChangeRequestService);
//# sourceMappingURL=change-request.service.js.map