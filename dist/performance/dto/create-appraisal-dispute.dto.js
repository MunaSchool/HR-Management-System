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
exports.CreateAppraisalDisputeDto = void 0;
const class_validator_1 = require("class-validator");
const performance_enums_1 = require("../enums/performance.enums");
class CreateAppraisalDisputeDto {
    appraisalId;
    assignmentId;
    cycleId;
    raisedByEmployeeId;
    reason;
    details;
    status;
    assignedReviewerEmployeeId;
}
exports.CreateAppraisalDisputeDto = CreateAppraisalDisputeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "appraisalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "assignmentId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "cycleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "raisedByEmployeeId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(performance_enums_1.AppraisalDisputeStatus),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppraisalDisputeDto.prototype, "assignedReviewerEmployeeId", void 0);
//# sourceMappingURL=create-appraisal-dispute.dto.js.map