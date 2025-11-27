import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppraisalTemplate,   AppraisalTemplateDocument } from './models/appraisal-template.schema';
import { AppraisalCycle,   AppraisalCycleDocument } from './models/appraisal-cycle.schema';
import { AppraisalAssignment,   AppraisalAssignmentDocument } from './models/appraisal-assignment.schema';
import { AppraisalRecord,   AppraisalRecordDocument } from './models/appraisal-record.schema';
import { AppraisalDispute, AppraisalDisputeDocument } from './models/appraisal-dispute.schema';
import { EmployeeProfile } from '../employee-profile/models/employee-profile.schema';
import { Department } from '../organization-structure/models/department.schema';
import { AppraisalCycleStatus,  AppraisalAssignmentStatus, 
    AppraisalRecordStatus, AppraisalDisputeStatus,} from '../performance/enums/performance.enums';

@Injectable()
export class PerformanceService {
    constructor(
        @InjectModel(AppraisalTemplate.name) 
        private appraisalTemplateModel: Model<AppraisalTemplateDocument>,
        @InjectModel(AppraisalCycle.name) 
        private appraisalCycleModel: Model<AppraisalCycleDocument>,
        @InjectModel(AppraisalAssignment.name) 
        private appraisalAssignmentModel: Model<AppraisalAssignmentDocument>,
        @InjectModel(AppraisalRecord.name) 
        private appraisalRecordModel: Model<AppraisalRecordDocument>,
        @InjectModel(AppraisalDispute.name) 
        private appraisalDisputeModel: Model<AppraisalDisputeDocument>,
        @InjectModel(EmployeeProfile.name) 
        private employeeProfileModel: Model<EmployeeProfile>,
        @InjectModel(Department.name) 
        private departmentModel: Model<Department>,
    ) {}

    // Appraisal Template Methods
    async createAppraisalTemplate(createTemplateDto: any) {
        const template = new this.appraisalTemplateModel(createTemplateDto);
        return await template.save();
    }

    async getAllAppraisalTemplates() {
        return await this.appraisalTemplateModel
      .find({ isActive: true })
      .populate('applicableDepartmentIds', 'name')
      .populate('applicablePositionIds', 'title')
      .exec();
    }

    async getAppraisalTemplateById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid template ID');
        }
        const template = await this.appraisalTemplateModel
        .findById(id)
        .populate('applicableDepartmentIds', 'name')
        .populate('applicablePositionIds', 'title')
        .exec();
        
        if (!template) {
            throw new NotFoundException('Appraisal template not found');
        }
        return template;
    }

    async updateAppraisalTemplate(id: string, updateTemplateDto: any) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid template ID');
        }
        
        const template = await this.appraisalTemplateModel
        .findByIdAndUpdate(id, updateTemplateDto, { new: true })
        .exec();
        
        if (!template) {
            throw new NotFoundException('Appraisal template not found');
        }
        return template;
    }

    // Appraisal Cycle Methods
    async createAppraisalCycle(createCycleDto: any) {
        // Validate dates
        if (new Date(createCycleDto.startDate) >= new Date(createCycleDto.endDate)) {
            throw new BadRequestException('Start date must be before end date');
        }

        const cycle = new this.appraisalCycleModel(createCycleDto);
        return await cycle.save();
    }

    async getAllAppraisalCycles() {
        return await this.appraisalCycleModel
        .find()
        .populate('templateAssignments.templateId', 'name templateType')
        .populate('templateAssignments.departmentIds', 'name')
        .sort({ startDate: -1 })
        .exec();
    }

    async getAppraisalCycleById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid cycle ID');
        }
        
        const cycle = await this.appraisalCycleModel
        .findById(id)
        .populate('templateAssignments.templateId', 'name templateType')
        .populate('templateAssignments.departmentIds', 'name')
        .exec();
        
        if (!cycle) {
            throw new NotFoundException('Appraisal cycle not found');
        }
        return cycle;
    }

    async updateAppraisalCycleStatus(id: string, status: AppraisalCycleStatus) {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid cycle ID');
        }

        const updateData: any = { status };
        
        // Set timestamps based on status changes
        if (status === AppraisalCycleStatus.ACTIVE) {
        updateData.publishedAt = new Date();
        } 
        else if (status === AppraisalCycleStatus.CLOSED) {
        updateData.closedAt = new Date();
        } 
        else if (status === AppraisalCycleStatus.ARCHIVED) {
        updateData.archivedAt = new Date();
        }

        const cycle = await this.appraisalCycleModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
        
        if (!cycle) {
            throw new NotFoundException('Appraisal cycle not found');
        }
        return cycle;
    }

    // Appraisal Assignment Methods
    async createAppraisalAssignments(cycleId: string) {
        if (!Types.ObjectId.isValid(cycleId)) {
            throw new NotFoundException('Invalid cycle ID');
        }

        const cycle = await this.appraisalCycleModel.findById(cycleId).exec();
        if (!cycle) {
            throw new NotFoundException('Appraisal cycle not found');
        }
        //this method still  needs more implementation, ill get to it 7ader wallahy
        return [];
    }

    async getEmployeeAppraisals(employeeProfileId: string) {
        if (!Types.ObjectId.isValid(employeeProfileId)) {
            throw new NotFoundException('Invalid employee profile ID');
        }

        return await this.appraisalAssignmentModel
        .find({ employeeProfileId })
        .populate('cycleId', 'name cycleType startDate endDate status')
        .populate('templateId', 'name templateType')
        .populate('managerProfileId', 'firstName lastName')
        .populate('departmentId', 'name')
        .sort({ assignedAt: -1 })
        .exec();
    }

    async getManagerAppraisalAssignments(managerProfileId: string) {
        if (!Types.ObjectId.isValid(managerProfileId)) {
            throw new NotFoundException('Invalid manager profile ID');
        }

        return await this.appraisalAssignmentModel
        .find({ managerProfileId })
        .populate('employeeProfileId', 'firstName lastName position')
        .populate('cycleId', 'name cycleType startDate endDate status')
        .populate('templateId', 'name templateType')
        .populate('departmentId', 'name')
        .sort({ dueDate: 1 })
        .exec();
    }

    // Appraisal Record Methods
    async createOrUpdateAppraisalRecord(assignmentId: string, createRecordDto: any) {
        if (!Types.ObjectId.isValid(assignmentId)) {
            throw new NotFoundException('Invalid assignment ID');
        }

        const assignment = await this.appraisalAssignmentModel.findById(assignmentId).exec();
        if (!assignment) {
            throw new NotFoundException('Appraisal assignment not found');
        }

        // Calculate total score
        let totalScore = 0;
        if (createRecordDto.ratings && createRecordDto.ratings.length > 0) {
            totalScore = createRecordDto.ratings.reduce((sum: number, rating: any) => {
                return sum + (rating.weightedScore || rating.ratingValue);
            }, 0);
        }

        const recordData = {
        ...createRecordDto,
        assignmentId,
        cycleId: assignment.cycleId,
        templateId: assignment.templateId,
        employeeProfileId: assignment.employeeProfileId,
        managerProfileId: assignment.managerProfileId,
        totalScore,
        status: AppraisalRecordStatus.DRAFT,
        };

        // Find existing record or create new one
        let record = await this.appraisalRecordModel.findOne({ assignmentId }).exec();
        
        if (record) {
            record = await this.appraisalRecordModel
            .findOneAndUpdate({ assignmentId }, recordData, { new: true })
            .exec();
        } 
        else {
            record = new this.appraisalRecordModel(recordData);
            await record.save();
        }
        return record;
    }

    async submitAppraisalRecord(assignmentId: string) {
        if (!Types.ObjectId.isValid(assignmentId)) {
            throw new NotFoundException('Invalid assignment ID');
        }

        const record = await this.appraisalRecordModel.findOne({ assignmentId }).exec();
        if (!record) {
            throw new NotFoundException('Appraisal record not found');
        }

        // Update record status
        record.status = AppraisalRecordStatus.MANAGER_SUBMITTED;
        record.managerSubmittedAt = new Date();
        await record.save();

        // Update assignment status
        await this.appraisalAssignmentModel
        .findByIdAndUpdate(assignmentId, {
            status: AppraisalAssignmentStatus.SUBMITTED,
            submittedAt: new Date(),
            latestAppraisalId: record._id,
        })
        .exec();

        return record;
    }

    async publishAppraisalRecord(assignmentId: string, publishedByEmployeeId: string) {
        if (!Types.ObjectId.isValid(assignmentId)) {
            throw new NotFoundException('Invalid assignment ID');
        }

        const record = await this.appraisalRecordModel.findOne({ assignmentId }).exec();
        if (!record) {
            throw new NotFoundException('Appraisal record not found');
        }

        // Update record status
        record.status = AppraisalRecordStatus.HR_PUBLISHED;
        record.hrPublishedAt = new Date();
        record.publishedByEmployeeId = new Types.ObjectId(publishedByEmployeeId);
        await record.save();

        // Update assignment status
        await this.appraisalAssignmentModel
        .findByIdAndUpdate(assignmentId, {
            status: AppraisalAssignmentStatus.PUBLISHED,
            publishedAt: new Date(),
        })
        .exec();

        return record;
    }

    // Appraisal Dispute Methods
    async createAppraisalDispute(createDisputeDto: any) {
        const dispute = new this.appraisalDisputeModel(createDisputeDto);
        return await dispute.save();
    }

    async getAppraisalDisputes(cycleId?: string) {
        const query: any = {};
        if (cycleId && Types.ObjectId.isValid(cycleId)) {
            query.cycleId = new Types.ObjectId(cycleId);
        }

        return await this.appraisalDisputeModel
        .find(query)
        .populate('appraisalId')
        .populate('assignmentId')
        .populate('cycleId', 'name cycleType')
        .populate('raisedByEmployeeId', 'firstName lastName')
        .populate('assignedReviewerEmployeeId', 'firstName lastName')
        .populate('resolvedByEmployeeId', 'firstName lastName')
        .sort({ submittedAt: -1 })
        .exec();
    }

    async updateDisputeStatus(disputeId: string, status: AppraisalDisputeStatus, resolutionData?: any) {
        if (!Types.ObjectId.isValid(disputeId)) {
            throw new NotFoundException('Invalid dispute ID');
        }

        const updateData: any = { status };
        
        if (status === AppraisalDisputeStatus.ADJUSTED || status === AppraisalDisputeStatus.REJECTED) {
            updateData.resolvedAt = new Date();
            if (resolutionData?.resolvedByEmployeeId) {
                updateData.resolvedByEmployeeId = new Types.ObjectId(resolutionData.resolvedByEmployeeId);
            }
            if (resolutionData?.resolutionSummary) {
                updateData.resolutionSummary = resolutionData.resolutionSummary;
            }
        }

        const dispute = await this.appraisalDisputeModel
        .findByIdAndUpdate(disputeId, updateData, { new: true })
        .exec();
        
        if (!dispute) {
            throw new NotFoundException('Appraisal dispute not found');
        }
        return dispute;
    }

}