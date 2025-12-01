import { Types } from "mongoose";
export declare class NotificationLogCreateDto {
    to: Types.ObjectId;
    type: string;
    message: string;
}
