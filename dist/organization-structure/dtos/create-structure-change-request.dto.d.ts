import { StructureRequestType } from '../enums/organization-structure.enums';
export declare class CreateStructureChangeRequestDto {
    requestType: StructureRequestType;
    targetDepartmentId?: string;
    targetPositionId?: string;
    details?: string;
    reason?: string;
}
