import { AppraisalTemplateType, AppraisalRatingScaleType } from '../enums/performance.enums';
export declare class RatingScaleDefinitionDto {
    type: AppraisalRatingScaleType;
    min: number;
    max: number;
    step?: number;
    labels?: string[];
}
export declare class EvaluationCriterionDto {
    key: string;
    title: string;
    details?: string;
    weight?: number;
    maxScore?: number;
    required?: boolean;
}
export declare class CreateAppraisalTemplateDto {
    name: string;
    description?: string;
    templateType: AppraisalTemplateType;
    ratingScale: RatingScaleDefinitionDto;
    criteria: EvaluationCriterionDto[];
    instructions?: string;
    applicableDepartmentIds?: string[];
    applicablePositionIds?: string[];
    isActive?: boolean;
}
