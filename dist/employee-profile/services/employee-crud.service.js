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
exports.EmployeeCrudService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const employee_profile_schema_1 = require("../models/employee-profile.schema");
const employee_system_role_schema_1 = require("../models/employee-system-role.schema");
let EmployeeCrudService = class EmployeeCrudService {
    employeeProfileModel;
    employeeRoleModel;
    constructor(employeeProfileModel, employeeRoleModel) {
        this.employeeProfileModel = employeeProfileModel;
        this.employeeRoleModel = employeeRoleModel;
    }
    async create(employeeData) {
        const { roles, permissions, ...profileData } = employeeData;
        const newEmployee = await this.employeeProfileModel.create({
            ...profileData,
            fullName: `${profileData.firstName} ${profileData.lastName}`,
        });
        const roleAssignment = await this.employeeRoleModel.create({
            employeeProfileId: newEmployee._id,
            roles: roles,
            permissions: permissions || [],
            isActive: true,
        });
        const updated = await this.employeeProfileModel.findByIdAndUpdate(newEmployee._id, { accessProfileId: roleAssignment._id }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return updated;
    }
    async findAll() {
        const employees = await this.employeeProfileModel.find();
        return employees;
    }
    async findById(id) {
        const employee = await this.employeeProfileModel.findById(id);
        if (!employee) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return employee;
    }
    async update(id, updateData) {
        const updatedEmployee = await this.employeeProfileModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEmployee) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return updatedEmployee;
    }
    async delete(id) {
        const deletedEmployee = await this.employeeProfileModel.findByIdAndDelete(id);
        if (!deletedEmployee) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        return deletedEmployee;
    }
};
exports.EmployeeCrudService = EmployeeCrudService;
exports.EmployeeCrudService = EmployeeCrudService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], EmployeeCrudService);
//# sourceMappingURL=employee-crud.service.js.map