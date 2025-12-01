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
exports.CandidateRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const candidate_schema_1 = require("../models/candidate.schema");
const bcrypt = __importStar(require("bcrypt"));
let CandidateRegistrationService = class CandidateRegistrationService {
    candidateModel;
    constructor(candidateModel) {
        this.candidateModel = candidateModel;
    }
    async registerCandidate(registerDto) {
        if (!registerDto.email || !registerDto.password || !registerDto.firstName || !registerDto.lastName || !registerDto.nationalId) {
            throw new common_1.BadRequestException('Email, password, first name, last name, and national ID are required');
        }
        const existingCandidate = await this.candidateModel.findOne({
            personalEmail: registerDto.email.toLowerCase()
        }).exec();
        if (existingCandidate) {
            throw new common_1.ConflictException('A candidate with this email already exists');
        }
        const existingNationalId = await this.candidateModel.findOne({
            nationalId: registerDto.nationalId
        }).exec();
        if (existingNationalId) {
            throw new common_1.ConflictException('A candidate with this national ID already exists');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);
        const candidateNumber = await this.generateCandidateNumber();
        const candidate = await this.candidateModel.create({
            candidateNumber,
            personalEmail: registerDto.email.toLowerCase(),
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            fullName: `${registerDto.firstName} ${registerDto.lastName}`,
            nationalId: registerDto.nationalId,
            mobilePhone: registerDto.phoneNumber,
            dateOfBirth: registerDto.dateOfBirth,
            positionId: registerDto.positionId,
            departmentId: registerDto.departmentId,
            resumeUrl: registerDto.resumeUrl,
            status: 'APPLIED',
            applicationDate: new Date(),
        });
        const { password, ...candidateWithoutPassword } = candidate.toObject();
        return {
            success: true,
            message: 'Candidate registered successfully',
            data: candidateWithoutPassword,
        };
    }
    async generateCandidateNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const startOfDay = new Date(year, date.getMonth(), date.getDate());
        const endOfDay = new Date(year, date.getMonth(), date.getDate() + 1);
        const count = await this.candidateModel.countDocuments({
            applicationDate: { $gte: startOfDay, $lt: endOfDay }
        });
        const sequence = String(count + 1).padStart(3, '0');
        return `CAN-${year}${month}${day}-${sequence}`;
    }
    async getCandidateByEmail(email) {
        return this.candidateModel.findOne({ personalEmail: email.toLowerCase() }).exec();
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async updateCandidateProfile(candidateId, updateDto) {
        const { password, email, status, ...safeUpdateData } = updateDto;
        const updated = await this.candidateModel.findByIdAndUpdate(candidateId, { $set: safeUpdateData }, { new: true }).exec();
        if (!updated) {
            throw new common_1.BadRequestException('Candidate not found');
        }
        const { password: pwd, ...candidateData } = updated.toObject();
        return candidateData;
    }
    async changePassword(candidateId, currentPassword, newPassword) {
        const candidate = await this.candidateModel.findById(candidateId).exec();
        if (!candidate) {
            throw new common_1.BadRequestException('Candidate not found');
        }
        if (!candidate.password) {
            throw new common_1.BadRequestException('Candidate password not set');
        }
        const isValidPassword = await this.verifyPassword(currentPassword, candidate.password);
        if (!isValidPassword) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await this.candidateModel.findByIdAndUpdate(candidateId, { password: hashedPassword }, { new: true }).exec();
        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
    async getCandidateProfile(candidateId) {
        const candidate = await this.candidateModel.findById(candidateId).exec();
        if (!candidate) {
            throw new common_1.BadRequestException('Candidate not found');
        }
        const { password, ...candidateData } = candidate.toObject();
        return candidateData;
    }
};
exports.CandidateRegistrationService = CandidateRegistrationService;
exports.CandidateRegistrationService = CandidateRegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(candidate_schema_1.Candidate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CandidateRegistrationService);
//# sourceMappingURL=candidate-registration.service.js.map