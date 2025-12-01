import { Model } from 'mongoose';
import { EmployeeProfileDocument } from '../models/employee-profile.schema';
import { EmployeeProfileChangeRequest } from '../models/ep-change-request.schema';
import { CreateChangeRequestDto } from '../dto/create-change-request.dto';
import { ProcessChangeRequestDto } from '../dto/process-change-request.dto';
import { NotificationLogService } from '../../time-management/services/notification-log.service';
export declare class ChangeRequestService {
    private employeeProfileModel;
    private changeRequestModel;
    private notificationLogService;
    constructor(employeeProfileModel: Model<EmployeeProfileDocument>, changeRequestModel: Model<EmployeeProfileChangeRequest>, notificationLogService: NotificationLogService);
    createChangeRequest(employeeId: string, userId: string, createDto: CreateChangeRequestDto): Promise<EmployeeProfileChangeRequest>;
    getMyChangeRequests(employeeId: string): Promise<EmployeeProfileChangeRequest[]>;
    getPendingChangeRequests(): Promise<EmployeeProfileChangeRequest[]>;
    getChangeRequestById(requestId: string): Promise<EmployeeProfileChangeRequest>;
    processChangeRequest(requestId: string, userId: string, userRole: string, processDto: ProcessChangeRequestDto): Promise<EmployeeProfileChangeRequest>;
}
