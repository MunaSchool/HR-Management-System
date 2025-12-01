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
exports.HrAdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_profile_schema_1 = require("../models/employee-profile.schema");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
let HrAdminService = class HrAdminService {
    employeeProfileModel;
    constructor(employeeProfileModel) {
        this.employeeProfileModel = employeeProfileModel;
    }
    async searchEmployees(searchQuery, status, departmentId) {
        const filter = {};
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
        return await this.employeeProfileModel
            .find(filter)
            .populate('primaryPositionId')
            .populate('primaryDepartmentId')
            .exec();
    }
    async updateEmployeeMasterData(employeeId, userId, userRole, updateDto) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        const updated = await this.employeeProfileModel.findByIdAndUpdate(employeeId, {
            ...updateDto,
            lastModifiedBy: userId,
            lastModifiedAt: new Date(),
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return updated;
    }
    async deactivateEmployee(employeeId, userId, userRole, status, effectiveDate) {
        if (![employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.SYSTEM_ADMIN].includes(userRole)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        const updated = await this.employeeProfileModel.findByIdAndUpdate(employeeId, {
            status,
            statusEffectiveFrom: effectiveDate || new Date(),
            lastModifiedBy: userId,
            lastModifiedAt: new Date(),
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return updated;
    }
};
exports.HrAdminService = HrAdminService;
exports.HrAdminService = HrAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HrAdminService);
//# sourceMappingURL=hr-admin.service.js.map