"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const bcrypt = __importStar(require("bcrypt"));
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
        const { roles, permissions, password, ...profileData } = employeeData;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const newEmployee = await this.employeeProfileModel.create({
            ...profileData,
            ...(hashedPassword && { password: hashedPassword }),
            fullName: `${profileData.firstName} ${profileData.lastName}`,
        });
        const assignedRoles = roles && roles.length > 0 ? roles : ['department employee'];
        try {
            const roleAssignment = await this.employeeRoleModel.create({
                employeeProfileId: new mongoose_2.Types.ObjectId(newEmployee._id),
                roles: assignedRoles,
                permissions: permissions || [],
                isActive: true,
            });
            const updated = await this.employeeProfileModel.findByIdAndUpdate(newEmployee._id, { accessProfileId: roleAssignment._id }, { new: true }).populate('accessProfileId');
            if (!updated) {
                throw new common_1.NotFoundException('Employee profile not found after role assignment');
            }
            return updated;
        }
        catch (error) {
            await this.employeeProfileModel.findByIdAndDelete(newEmployee._id);
            throw error;
        }
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