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
exports.AssignRoleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const employee_profile_enums_1 = require("../enums/employee-profile.enums");
class AssignRoleDto {
    roles;
    permissions;
    isActive;
}
exports.AssignRoleDto = AssignRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of system roles to assign to the employee',
        enum: employee_profile_enums_1.SystemRole,
        isArray: true,
        example: ['HR Manager', 'System Admin'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(employee_profile_enums_1.SystemRole, { each: true }),
    __metadata("design:type", Array)
], AssignRoleDto.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of permission strings',
        example: ['read:employees', 'write:employees', 'delete:employees'],
        required: false,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], AssignRoleDto.prototype, "permissions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the role assignment is active',
        example: true,
        required: false,
        default: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AssignRoleDto.prototype, "isActive", void 0);
//# sourceMappingURL=assign-role.dto.js.map