import { Model } from 'mongoose';
import { EmployeeProfile, EmployeeProfileDocument } from '../models/employee-profile.schema';
import { EmployeeSystemRole } from '../models/employee-system-role.schema';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
export declare class EmployeeCrudService {
    private employeeProfileModel;
    private employeeRoleModel;
    constructor(employeeProfileModel: Model<EmployeeProfileDocument>, employeeRoleModel: Model<EmployeeSystemRole>);
    create(employeeData: CreateEmployeeDto): Promise<EmployeeProfileDocument>;
    findAll(): Promise<EmployeeProfileDocument[]>;
    findById(id: string): Promise<EmployeeProfileDocument>;
    update(id: string, updateData: Partial<EmployeeProfile>): Promise<EmployeeProfileDocument>;
    delete(id: string): Promise<EmployeeProfileDocument>;
}
