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
exports.CreateAppraisalCycleDto = exports.CycleTemplateAssignmentDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const performance_enums_1 = require("../enums/performance.enums");
class CycleTemplateAssignmentDto {
    templateId;
    departmentIds;
}
exports.CycleTemplateAssignmentDto = CycleTemplateAssignmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CycleTemplateAssignmentDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CycleTemplateAssignmentDto.prototype, "departmentIds", void 0);
class CreateAppraisalCycleDto {
    name;
    description;
    cycleType;
    startDate;
    endDate;
    managerDueDate;
    employeeAcknowledgementDueDate;
    templateAssignments;
    status;
}
exports.CreateAppraisalCycleDto = CreateAppraisalCycleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalCycleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalCycleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(performance_enums_1.AppraisalTemplateType),
    __metadata("design:type", String)
], CreateAppraisalCycleDto.prototype, "cycleType", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAppraisalCycleDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAppraisalCycleDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAppraisalCycleDto.prototype, "managerDueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateAppraisalCycleDto.prototype, "employeeAcknowledgementDueDate", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CycleTemplateAssignmentDto),
    __metadata("design:type", Array)
], CreateAppraisalCycleDto.prototype, "templateAssignments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(performance_enums_1.AppraisalCycleStatus),
    __metadata("design:type", String)
], CreateAppraisalCycleDto.prototype, "status", void 0);
//# sourceMappingURL=create-appraisal-cycle.dto.js.map