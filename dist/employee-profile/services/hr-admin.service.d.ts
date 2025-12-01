import { Model } from 'mongoose';
import { EmployeeProfileDocument } from '../models/employee-profile.schema';
import { UpdateEmployeeMasterDto } from '../dto/update-employee-master.dto';
import { EmployeeStatus } from '../enums/employee-profile.enums';
export declare class HrAdminService {
    private employeeProfileModel;
    constructor(employeeProfileModel: Model<EmployeeProfileDocument>);
    searchEmployees(searchQuery: string, status?: EmployeeStatus, departmentId?: string): Promise<EmployeeProfileDocument[]>;
    updateEmployeeMasterData(employeeId: string, userId: string, userRole: string, updateDto: UpdateEmployeeMasterDto): Promise<EmployeeProfileDocument>;
    deactivateEmployee(employeeId: string, userId: string, userRole: string, status: EmployeeStatus, effectiveDate?: Date): Promise<EmployeeProfileDocument>;
}
