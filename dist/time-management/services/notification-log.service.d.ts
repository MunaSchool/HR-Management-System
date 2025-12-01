import { NotificationLogCreateDto } from './../dtos/notification-log-create-dto';
import { NotificationLog, NotificationLogDocument } from './../models/notification-log.schema';
import { Model, Types } from 'mongoose';
export declare class NotificationLogService {
    private notificationLogModel;
    constructor(notificationLogModel: Model<NotificationLogDocument>);
    sendNotification(notifData: NotificationLogCreateDto): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
    }>;
    getAllNotifications(): Promise<NotificationLog[]>;
    getEmployeeNotifications(recepientId: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, NotificationLog, {}, {}> & NotificationLog & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
}
