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
exports.UpdateEmployeeMasterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
const update_contact_info_dto_1 = require("./update-contact-info.dto");
class UpdateEmployeeMasterDto {
    firstName;
    middleName;
    lastName;
    nationalId;
    gender;
    maritalStatus;
    dateOfBirth;
    mobilePhone;
    homePhone;
    personalEmail;
    workEmail;
    address;
    biography;
    profilePictureUrl;
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
    accessProfileId;
}
exports.UpdateEmployeeMasterDto = UpdateEmployeeMasterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "nationalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: employee_profile_enums_1.Gender }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.Gender),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: employee_profile_enums_1.MaritalStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.MaritalStatus),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEmployeeMasterDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "mobilePhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "homePhone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "personalEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "workEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: update_contact_info_dto_1.AddressDto }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", update_contact_info_dto_1.AddressDto)
], UpdateEmployeeMasterDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "biography", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEmployeeMasterDto.prototype, "dateOfHire", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: employee_profile_enums_1.EmployeeStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.EmployeeStatus),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEmployeeMasterDto.prototype, "statusEffectiveFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: employee_profile_enums_1.ContractType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.ContractType),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "contractType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: employee_profile_enums_1.WorkType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.WorkType),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "workType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEmployeeMasterDto.prototype, "contractStartDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], UpdateEmployeeMasterDto.prototype, "contractEndDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "primaryPositionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "primaryDepartmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "supervisorPositionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "payGradeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], UpdateEmployeeMasterDto.prototype, "accessProfileId", void 0);
//# sourceMappingURL=update-employee-master.dto.js.map