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
exports.CreateChangeRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateChangeRequestDto {
    requestDescription;
    reason;
    requestedChanges;
}
exports.CreateChangeRequestDto = CreateChangeRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the requested change',
        example: 'Request to update job title from Junior Developer to Senior Developer',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChangeRequestDto.prototype, "requestDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Reason for the change request',
        example: 'Promotion effective from January 2025',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateChangeRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requested changes as key-value pairs',
        example: { jobTitle: 'Senior Developer', department: 'Engineering' },
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateChangeRequestDto.prototype, "requestedChanges", void 0);
//# sourceMappingURL=create-change-request.dto.js.map