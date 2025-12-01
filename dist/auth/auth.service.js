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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const employee_system_role_schema_1 = require("../employee-profile/models/employee-system-role.schema");
let AuthService = class AuthService {
    employeeProfileModel;
    employeeRoleModel;
    jwtService;
    constructor(employeeProfileModel, employeeRoleModel, jwtService) {
        this.employeeProfileModel = employeeProfileModel;
        this.employeeRoleModel = employeeRoleModel;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingEmployee = await this.employeeProfileModel.findOne({
            employeeNumber: registerDto.employeeNumber
        });
        if (existingEmployee) {
            throw new common_1.ConflictException('Employee number already exists');
        }
        const existingEmail = await this.employeeProfileModel.findOne({
            workEmail: registerDto.workEmail
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already exists');
        }
        const existingNationalId = await this.employeeProfileModel.findOne({
            nationalId: registerDto.nationalId
        });
        if (existingNationalId) {
            throw new common_1.ConflictException('National ID already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const newEmployee = await this.employeeProfileModel.create({
            employeeNumber: registerDto.employeeNumber,
            workEmail: registerDto.workEmail,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            nationalId: registerDto.nationalId,
            dateOfHire: new Date(registerDto.dateOfHire),
            fullName: `${registerDto.firstName} ${registerDto.lastName}`,
        });
        const roleAssignment = await this.employeeRoleModel.create({
            employeeProfileId: newEmployee._id,
            roles: registerDto.roles || ['department employee'],
            permissions: registerDto.permissions || [],
            isActive: true,
        });
        await this.employeeProfileModel.findByIdAndUpdate(newEmployee._id, {
            accessProfileId: roleAssignment._id,
        });
        return 'Registered successfully';
    }
    async signIn(employeeNumber, password) {
        const employee = await this.employeeProfileModel
            .findOne({ employeeNumber })
            .populate('accessProfileId');
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        if (!employee.password) {
            throw new common_1.UnauthorizedException('Password not set for this employee');
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const roles = employee.accessProfileId
            ? employee.accessProfileId.roles || ['department employee']
            : ['department employee'];
        const payload = {
            userid: employee._id,
            roles,
            employeeNumber: employee.employeeNumber,
            email: employee.workEmail,
            status: employee.status,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
            payload: {
                userid: employee._id,
                roles,
                status: employee.status,
            },
        };
    }
    async findByEmployeeNumber(employeeNumber) {
        return this.employeeProfileModel.findOne({ employeeNumber });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __param(1, (0, mongoose_1.InjectModel)(employee_system_role_schema_1.EmployeeSystemRole.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map