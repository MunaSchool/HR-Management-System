import { Model, Types } from 'mongoose';
import { AppraisalTemplate, AppraisalTemplateDocument } from './models/appraisal-template.schema';
import { AppraisalCycle, AppraisalCycleDocument } from './models/appraisal-cycle.schema';
import { AppraisalAssignment, AppraisalAssignmentDocument } from './models/appraisal-assignment.schema';
import { AppraisalRecord, AppraisalRecordDocument } from './models/appraisal-record.schema';
import { AppraisalDispute, AppraisalDisputeDocument } from './models/appraisal-dispute.schema';
import { EmployeeProfileDocument } from '../employee-profile/models/employee-profile.schema';
import { Department } from '../organization-structure/models/department.schema';
import { AppraisalCycleStatus, AppraisalAssignmentStatus, AppraisalRecordStatus, AppraisalDisputeStatus } from '../performance/enums/performance.enums';
import { NotificationLogService } from '../time-management/services/notification-log.service';
export declare class PerformanceService {
    private appraisalTemplateModel;
    private appraisalCycleModel;
    private appraisalAssignmentModel;
    private appraisalRecordModel;
    private appraisalDisputeModel;
    private departmentModel;
    private employeeProfileModel;
    private notificationLogService;
    constructor(appraisalTemplateModel: Model<AppraisalTemplateDocument>, appraisalCycleModel: Model<AppraisalCycleDocument>, appraisalAssignmentModel: Model<AppraisalAssignmentDocument>, appraisalRecordModel: Model<AppraisalRecordDocument>, appraisalDisputeModel: Model<AppraisalDisputeDocument>, departmentModel: Model<Department>, employeeProfileModel: Model<EmployeeProfileDocument>, notificationLogService: NotificationLogService);
    private toObjectId;
    createDispute(dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createAppraisalTemplate(createTemplateDto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAllAppraisalTemplates(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getAppraisalTemplateById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateAppraisalTemplate(id: string, updateTemplateDto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalTemplate, {}, {}> & AppraisalTemplate & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    createAppraisalCycle(createCycleDto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAllAppraisalCycles(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getAppraisalCycleById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    updateAppraisalCycleStatus(id: string, status: AppraisalCycleStatus): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalCycle, {}, {}> & AppraisalCycle & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAppraisalAssignmentsByCycle(cycleId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    createAppraisalAssignments(cycleId: string): Promise<(import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getEmployeeAppraisals(employeeProfileId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getManagerAppraisalAssignments(managerProfileId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getAppraisalAssignmentById(assignmentId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateAppraisalAssignmentStatus(assignmentId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalAssignment, {}, {}> & AppraisalAssignment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    createOrUpdateAppraisalRecord(assignmentId: string, createRecordDto: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    submitAppraisalRecord(assignmentId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    publishAppraisalRecord(assignmentId: string, publishedByEmployeeId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAppraisalRecordById(recordId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateAppraisalRecordStatus(recordId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalRecord, {}, {}> & AppraisalRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    createAppraisalDispute(createDisputeDto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAppraisalDisputes(cycleId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateDisputeStatus(disputeId: string, status: AppraisalDisputeStatus, resolutionData?: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAppraisalDisputeById(disputeId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    assignDisputeReviewer(disputeId: string, reviewerId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, AppraisalDispute, {}, {}> & AppraisalDispute & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPerformanceAnalytics(cycleId?: string): Promise<{
        totalAssignments: number;
        completedAssignments: number;
        inProgressAssignments: number;
        notStartedAssignments: number;
        completionRate: string;
        averageScore: string | number;
        totalRecords: number;
    }>;
    getDepartmentPerformanceAnalytics(departmentId: string, cycleId?: string): Promise<{
        departmentId: string;
        totalEmployees: number;
        completedEvaluations: number;
        pendingEvaluations: number;
        completionRate: string;
        averageScore: string | number;
        assignments: {
            employeeId: Types.ObjectId;
            employeeName: string;
            status: AppraisalAssignmentStatus;
            assignedAt: Date;
            completedAt: Date | undefined;
        }[];
    }>;
    getHistoricalTrendAnalysis(employeeProfileId?: string): Promise<{
        totalRecords: number;
        trends: {
            employeeId: Types.ObjectId;
            employeeName: string;
            cycleName: any;
            cycleType: any;
            totalScore: number | undefined;
            publishedDate: Date | undefined;
        }[];
    }>;
    exportPerformanceReport(cycleId?: string): Promise<{
        generatedAt: Date;
        totalRecords: number;
        cycleId: string;
        data: {
            employeeName: string;
            position: any;
            managerName: string;
            cycleName: any;
            cycleType: any;
            templateName: any;
            totalScore: number | undefined;
            status: AppraisalRecordStatus;
            managerSubmittedAt: Date | undefined;
            hrPublishedAt: Date | undefined;
            ratings: import("./models/appraisal-record.schema").RatingEntry[];
            managerSummary: string | undefined;
            strengths: string | undefined;
            improvementAreas: string | undefined;
        }[];
    }>;
}
