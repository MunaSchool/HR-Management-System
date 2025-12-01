import { Model } from 'mongoose';
import { EmployeeProfileDocument } from '../models/employee-profile.schema';
import { UpdateContactInfoDto } from '../dto/update-contact-info.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PerformanceService } from '../../performance/performance.service';
import { NotificationLogService } from '../../time-management/services/notification-log.service';
export declare class EmployeeSelfServiceService {
    private employeeProfileModel;
    private performanceService;
    private notificationLogService;
    constructor(employeeProfileModel: Model<EmployeeProfileDocument>, performanceService: PerformanceService, notificationLogService: NotificationLogService);
    getMyProfile(employeeId: string): Promise<any>;
    updateMyContactInfo(employeeId: string, userId: string, updateDto: UpdateContactInfoDto): Promise<EmployeeProfileDocument>;
    updateMyProfile(employeeId: string, userId: string, updateDto: UpdateProfileDto): Promise<EmployeeProfileDocument>;
    getTeamMembers(managerPositionId: string): Promise<EmployeeProfileDocument[]>;
    getTeamMemberProfile(employeeId: string, managerPositionId: string): Promise<EmployeeProfileDocument>;
}
