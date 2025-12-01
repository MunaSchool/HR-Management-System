import { SystemRole } from '../enums/employee-profile.enums';
export declare class AssignRoleDto {
    roles: SystemRole[];
    permissions?: string[];
    isActive?: boolean;
}
