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
exports.TeamMemberSummaryDto = exports.EmployeeProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EmployeeProfileResponseDto {
    id;
    employeeNumber;
    firstName;
    middleName;
    lastName;
    fullName;
    nationalId;
    gender;
    maritalStatus;
    dateOfBirth;
    personalEmail;
    workEmail;
    mobilePhone;
    homePhone;
    address;
    profilePictureUrl;
    biography;
    dateOfHire;
    status;
    statusEffectiveFrom;
    contractType;
    workType;
    contractStartDate;
    contractEndDate;
    primaryPositionId;
    primaryDepartmentId;
    supervisorPositionId;
    payGradeId;
    appraisalHistory;
    createdAt;
    updatedAt;
}
exports.EmployeeProfileResponseDto = EmployeeProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "nationalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "workEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "mobilePhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "homePhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], EmployeeProfileResponseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "biography", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "dateOfHire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "statusEffectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "workType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "contractStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "contractEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "primaryPositionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "primaryDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "supervisorPositionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], EmployeeProfileResponseDto.prototype, "payGradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Appraisal history from Performance Module' }),
    __metadata("design:type", Object)
], EmployeeProfileResponseDto.prototype, "appraisalHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], EmployeeProfileResponseDto.prototype, "updatedAt", void 0);
class TeamMemberSummaryDto {
    id;
    employeeNumber;
    fullName;
    dateOfHire;
    status;
    primaryPositionId;
    primaryDepartmentId;
    profilePictureUrl;
}
exports.TeamMemberSummaryDto = TeamMemberSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "employeeNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], TeamMemberSummaryDto.prototype, "dateOfHire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "primaryPositionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "primaryDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], TeamMemberSummaryDto.prototype, "profilePictureUrl", void 0);
//# sourceMappingURL=employee-profile-response.dto.js.map