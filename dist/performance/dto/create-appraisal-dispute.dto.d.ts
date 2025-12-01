import { AppraisalDisputeStatus } from '../enums/performance.enums';
export declare class CreateAppraisalDisputeDto {
    appraisalId: string;
    assignmentId: string;
    cycleId: string;
    raisedByEmployeeId: string;
    reason: string;
    details?: string;
    status?: AppraisalDisputeStatus;
    assignedReviewerEmployeeId?: string;
}
