import { Model } from 'mongoose';
import { EmployeeSystemRoleDocument } from '../models/employee-system-role.schema';
import { EmployeeProfile } from '../models/employee-profile.schema';
import { AssignRoleDto } from '../dto/assign-role.dto';
import { SystemRole } from '../enums/employee-profile.enums';
export declare class EmployeeRoleService {
    private employeeRoleModel;
    private employeeProfileModel;
    constructor(employeeRoleModel: Model<EmployeeSystemRoleDocument>, employeeProfileModel: Model<EmployeeProfile>);
    private resolveEmployeeId;
    assignRolesToEmployee(employeeId: string, assignRoleDto: AssignRoleDto, assignedBy: string, assignerRole: string): Promise<EmployeeSystemRoleDocument>;
    getEmployeeRoles(employeeId: string): Promise<EmployeeSystemRoleDocument>;
    getEmployeesByRole(role: SystemRole): Promise<EmployeeSystemRoleDocument[]>;
    removeRolesFromEmployee(employeeId: string, removedBy: string, removerRole: string): Promise<EmployeeSystemRoleDocument>;
    addPermissionToEmployee(employeeId: string, permission: string, assignedBy: string, assignerRole: string): Promise<EmployeeSystemRoleDocument>;
    removePermissionFromEmployee(employeeId: string, permission: string, removedBy: string, removerRole: string): Promise<EmployeeSystemRoleDocument>;
    getAllRoleAssignments(userRole: string): Promise<EmployeeSystemRoleDocument[]>;
}
