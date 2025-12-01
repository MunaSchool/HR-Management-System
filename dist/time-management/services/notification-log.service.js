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
exports.NotificationLogService = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const notification_log_schema_1 = require("./../models/notification-log.schema");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("mongoose");
let NotificationLogService = class NotificationLogService {
    notificationLogModel;
    constructor(notificationLogModel) {
        this.notificationLogModel = notificationLogModel;
    }
    async sendNotification(notifData) {
        if (!notifData.to) {
            throw new common_1.BadRequestException("Recepient cannot be empty!");
        }
        if (!notifData.type) {
            throw new common_1.BadRequestException("Type cannot be empty!");
        }
        const notification = await this.notificationLogModel.create(notifData);
        return {
            success: true,
            message: "Notification sent successfully!",
            data: notification
        };
    }
    async getAllNotifications() {
        const notifications = await this.notificationLogModel.find();
        if (!notifications)
            throw new common_1.NotFoundException("No notifications found!");
        return notifications;
    }
    async getEmployeeNotifications(recepientId) {
        return this.notificationLogModel.find({ to: recepientId });
    }
};
exports.NotificationLogService = NotificationLogService;
exports.NotificationLogService = NotificationLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_log_schema_1.NotificationLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], NotificationLogService);
//# sourceMappingURL=notification-log.service.js.map