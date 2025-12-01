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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeManagementController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const notification_log_service_1 = require("./services/notification-log.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let TimeManagementController = class TimeManagementController {
    notificationLogService;
    constructor(notificationLogService) {
        this.notificationLogService = notificationLogService;
    }
    async getMyNotifications(user) {
        return this.notificationLogService.getEmployeeNotifications(new mongoose_1.Types.ObjectId(user.employeeId));
    }
    async getAllNotifications() {
        return this.notificationLogService.getAllNotifications();
    }
};
exports.TimeManagementController = TimeManagementController;
__decorate([
    (0, common_1.Get)('notifications'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getMyNotifications", null);
__decorate([
    (0, common_1.Get)('notifications/all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeManagementController.prototype, "getAllNotifications", null);
exports.TimeManagementController = TimeManagementController = __decorate([
    (0, common_1.Controller)('time-management'),
    __metadata("design:paramtypes", [notification_log_service_1.NotificationLogService])
], TimeManagementController);
//# sourceMappingURL=time-management.controller.js.map