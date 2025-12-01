import { AppraisalRecordStatus } from '../enums/performance.enums';
export declare class RatingEntryDto {
    key: string;
    title: string;
    ratingValue: number;
    ratingLabel?: string;
    weightedScore?: number;
    comments?: string;
}
export declare class CreateAppraisalRecordDto {
    ratings: RatingEntryDto[];
    totalScore?: number;
    overallRatingLabel?: string;
    managerSummary?: string;
    strengths?: string;
    improvementAreas?: string;
    status?: AppraisalRecordStatus;
}
