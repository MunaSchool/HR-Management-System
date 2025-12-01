import { PerformanceService } from './performance.service';
import { CreateAppraisalTemplateDto } from './dto/create-appraisal-template.dto';
import { CreateAppraisalCycleDto } from './dto/create-appraisal-cycle.dto';
import { CreateAppraisalRecordDto } from './dto/create-appraisal-record.dto';
import { CreateAppraisalDisputeDto } from './dto/create-appraisal-dispute.dto';
import { UpdateAppraisalDisputeDto } from './dto/update-appraisal-dispute.dto';
import { UpdateAppraisalCycleStatusDto } from './dto/update-appraisal-cycle-status.dto';
import { PublishAppraisalRecordDto } from './dto/publish-appraisal-record.dto';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
export declare class PerformanceController {
    private readonly performanceService;
    constructor(performanceService: PerformanceService);
    createAppraisalTemplate(createTemplateDto: CreateAppraisalTemplateDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllAppraisalTemplates(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAppraisalTemplateById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateAppraisalTemplate(id: string, updateTemplateDto: CreateAppraisalTemplateDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-template.schema").AppraisalTemplate, {}, {}> & import("./models/appraisal-template.schema").AppraisalTemplate & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createAppraisalCycle(createCycleDto: CreateAppraisalCycleDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllAppraisalCycles(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAppraisalCycleById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    updateAppraisalCycleStatus(id: string, updateStatusDto: UpdateAppraisalCycleStatusDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-cycle.schema").AppraisalCycle, {}, {}> & import("./models/appraisal-cycle.schema").AppraisalCycle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createAppraisalAssignments(cycleId: string): Promise<(import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getEmployeeAppraisals(employeeProfileId: string, user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getManagerAppraisalAssignments(managerProfileId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    createOrUpdateAppraisalRecord(assignmentId: string, createRecordDto: CreateAppraisalRecordDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    submitAppraisalRecord(assignmentId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    publishAppraisalRecord(assignmentId: string, publishDto: PublishAppraisalRecordDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createAppraisalDispute(createDisputeDto: CreateAppraisalDisputeDto, user: CurrentUserData): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAppraisalDisputes(cycleId?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateDisputeStatus(disputeId: string, updateDisputeDto: UpdateAppraisalDisputeDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getCycleAssignments(cycleId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getAppraisalAssignment(assignmentId: string, user: CurrentUserData): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAppraisalRecord(recordId: string, user: CurrentUserData): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAppraisalDispute(disputeId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAssignmentStatus(assignmentId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-assignment.schema").AppraisalAssignment, {}, {}> & import("./models/appraisal-assignment.schema").AppraisalAssignment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateRecordStatus(recordId: string, status: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-record.schema").AppraisalRecord, {}, {}> & import("./models/appraisal-record.schema").AppraisalRecord & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    assignDisputeReviewer(disputeId: string, reviewerId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/appraisal-dispute.schema").AppraisalDispute, {}, {}> & import("./models/appraisal-dispute.schema").AppraisalDispute & Required<{
        _id: import("mongoose").Types.ObjectId;
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
            employeeId: import("mongoose").Types.ObjectId;
            employeeName: string;
            status: import("./enums/performance.enums").AppraisalAssignmentStatus;
            assignedAt: Date;
            completedAt: Date | undefined;
        }[];
    }>;
    getHistoricalTrendAnalysis(employeeProfileId?: string): Promise<{
        totalRecords: number;
        trends: {
            employeeId: import("mongoose").Types.ObjectId;
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
            status: import("./enums/performance.enums").AppraisalRecordStatus;
            managerSubmittedAt: Date | undefined;
            hrPublishedAt: Date | undefined;
            ratings: import("./models/appraisal-record.schema").RatingEntry[];
            managerSummary: string | undefined;
            strengths: string | undefined;
            improvementAreas: string | undefined;
        }[];
    }>;
}
