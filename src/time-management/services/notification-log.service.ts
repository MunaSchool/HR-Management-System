import { NotificationLogCreateDto } from './../dtos/notification-log-create-dto';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationLog, NotificationLogDocument, NotificationLogSchema } from './../models/notification-log.schema';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationLogService{
    constructor(
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLogDocument>,
    ){}
    async sendNotification(notifData:NotificationLogCreateDto){
        if(!notifData.to){
            throw new BadRequestException("Recepient cannot be empty!")
        }
        if(!notifData.type){
            throw new BadRequestException("Type cannot be empty!")
        }
        const notification = await this.notificationLogModel.create(notifData)
        return{
            success: true,
            message:"Notification sent successfully!",
            data: notification
        }
    }
    async getAllNotifications():Promise<NotificationLog[]>{
        const notifications = await this.notificationLogModel.find()
        if(!notifications) throw new NotFoundException("No notifications found!")
        return notifications;
    }
    async getEmployeeNotifications(recepientId:Types.ObjectId){
        return this.notificationLogModel.find({to: recepientId})
    }
}