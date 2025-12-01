import { AppraisalDisputeStatus } from '../enums/performance.enums';
export declare class UpdateAppraisalDisputeDto {
    status: AppraisalDisputeStatus;
    resolutionSummary?: string;
    resolvedByEmployeeId?: string;
}
