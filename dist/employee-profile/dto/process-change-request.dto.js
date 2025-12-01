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
exports.ProcessChangeRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProcessChangeRequestDto {
    approved;
    comments;
}
exports.ProcessChangeRequestDto = ProcessChangeRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether to approve or reject the change request',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProcessChangeRequestDto.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Comments from the reviewer',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessChangeRequestDto.prototype, "comments", void 0);
//# sourceMappingURL=process-change-request.dto.js.map