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
exports.EmployeeSelfServiceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_profile_schema_1 = require("../models/employee-profile.schema");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
const performance_service_1 = require("../../performance/performance.service");
const notification_log_service_1 = require("../../time-management/services/notification-log.service");
let EmployeeSelfServiceService = class EmployeeSelfServiceService {
    employeeProfileModel;
    performanceService;
    notificationLogService;
    constructor(employeeProfileModel, performanceService, notificationLogService) {
        this.employeeProfileModel = employeeProfileModel;
        this.performanceService = performanceService;
        this.notificationLogService = notificationLogService;
    }
    async getMyProfile(employeeId) {
        const profile = await this.employeeProfileModel
            .findById(employeeId)
            .populate('accessProfileId')
            .populate('primaryPositionId')
            .populate('primaryDepartmentId')
            .populate('supervisorPositionId')
            .populate('payGradeId')
            .exec();
        if (!profile) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        let appraisalHistory = [];
        try {
            appraisalHistory = await this.performanceService.getEmployeeAppraisals(employeeId);
        }
        catch (error) {
            console.error('Failed to fetch appraisal history:', error.message);
        }
        return {
            ...profile.toObject(),
            appraisalHistory,
        };
    }
    async updateMyContactInfo(employeeId, userId, updateDto) {
        const updated = await this.employeeProfileModel.findByIdAndUpdate(employeeId, {
            ...updateDto,
            lastModifiedBy: userId,
            lastModifiedAt: new Date(),
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(employeeId),
            type: 'N-037',
            message: 'Your contact information has been updated successfully.',
        });
        return updated;
    }
    async updateMyProfile(employeeId, userId, updateDto) {
        const updated = await this.employeeProfileModel.findByIdAndUpdate(employeeId, {
            ...updateDto,
            lastModifiedBy: userId,
            lastModifiedAt: new Date(),
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(employeeId),
            type: 'N-037',
            message: 'Your profile has been updated successfully.',
        });
        return updated;
    }
    async getTeamMembers(managerPositionId) {
        return await this.employeeProfileModel
            .find({ supervisorPositionId: managerPositionId, status: employee_profile_enums_1.EmployeeStatus.ACTIVE })
            .populate('primaryPositionId')
            .populate('primaryDepartmentId')
            .select('-password -nationalId -dateOfBirth -personalEmail -homePhone -address')
            .exec();
    }
    async getTeamMemberProfile(employeeId, managerPositionId) {
        const employee = await this.employeeProfileModel
            .findOne({
            _id: employeeId,
            supervisorPositionId: managerPositionId,
        })
            .populate('primaryPositionId')
            .populate('primaryDepartmentId')
            .select('-password -nationalId -dateOfBirth -personalEmail -homePhone -address')
            .exec();
        if (!employee) {
            throw new common_1.ForbiddenException('Employee is not a direct report or not found');
        }
        return employee;
    }
};
exports.EmployeeSelfServiceService = EmployeeSelfServiceService;
exports.EmployeeSelfServiceService = EmployeeSelfServiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        performance_service_1.PerformanceService,
        notification_log_service_1.NotificationLogService])
], EmployeeSelfServiceService);
//# sourceMappingURL=employee-self-service.service.js.map