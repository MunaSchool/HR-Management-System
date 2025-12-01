import { Types } from 'mongoose';
import { NotificationLogService } from './services/notification-log.service';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
export declare class TimeManagementController {
    private readonly notificationLogService;
    constructor(notificationLogService: NotificationLogService);
    getMyNotifications(user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/notification-log.schema").NotificationLog, {}, {}> & import("./models/notification-log.schema").NotificationLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/notification-log.schema").NotificationLog, {}, {}> & import("./models/notification-log.schema").NotificationLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getAllNotifications(): Promise<import("./models/notification-log.schema").NotificationLog[]>;
}
