export declare class EmployeeProfileResponseDto {
    id: string;
    employeeNumber: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    fullName?: string;
    nationalId: string;
    gender?: string;
    maritalStatus?: string;
    dateOfBirth?: Date;
    personalEmail?: string;
    workEmail?: string;
    mobilePhone?: string;
    homePhone?: string;
    address?: {
        city?: string;
        streetAddress?: string;
        country?: string;
    };
    profilePictureUrl?: string;
    biography?: string;
    dateOfHire: Date;
    status: string;
    statusEffectiveFrom?: Date;
    contractType?: string;
    workType?: string;
    contractStartDate?: Date;
    contractEndDate?: Date;
    primaryPositionId?: string;
    primaryDepartmentId?: string;
    supervisorPositionId?: string;
    payGradeId?: string;
    appraisalHistory?: {
        lastAppraisalDate?: Date;
        lastAppraisalScore?: number;
        lastAppraisalRatingLabel?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class TeamMemberSummaryDto {
    id: string;
    employeeNumber: string;
    fullName: string;
    dateOfHire: Date;
    status: string;
    primaryPositionId?: string;
    primaryDepartmentId?: string;
    profilePictureUrl?: string;
}
