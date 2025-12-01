import { AppraisalTemplateType, AppraisalCycleStatus } from '../enums/performance.enums';
export declare class CycleTemplateAssignmentDto {
    templateId: string;
    departmentIds: string[];
}
export declare class CreateAppraisalCycleDto {
    name: string;
    description?: string;
    cycleType: AppraisalTemplateType;
    startDate: Date;
    endDate: Date;
    managerDueDate?: Date;
    employeeAcknowledgementDueDate?: Date;
    templateAssignments: CycleTemplateAssignmentDto[];
    status?: AppraisalCycleStatus;
}
