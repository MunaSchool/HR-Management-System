import { Controller, Get, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationLogService } from './services/notification-log.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';

@Controller('time-management')
export class TimeManagementController {
  constructor(private readonly notificationLogService: NotificationLogService) {}

  @Get('notifications')
  @UseGuards(AuthGuard)
  async getMyNotifications(@CurrentUser() user: CurrentUserData) {
    return this.notificationLogService.getEmployeeNotifications(new Types.ObjectId(user.employeeId));
  }

  @Get('notifications/all')
  @UseGuards(AuthGuard)
  async getAllNotifications() {
    return this.notificationLogService.getAllNotifications();
  }
}
