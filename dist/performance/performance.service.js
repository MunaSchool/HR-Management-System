"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appraisal_template_schema_1 = require("./models/appraisal-template.schema");
const appraisal_cycle_schema_1 = require("./models/appraisal-cycle.schema");
const appraisal_assignment_schema_1 = require("./models/appraisal-assignment.schema");
const appraisal_record_schema_1 = require("./models/appraisal-record.schema");
const appraisal_dispute_schema_1 = require("./models/appraisal-dispute.schema");
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const department_schema_1 = require("../organization-structure/models/department.schema");
const performance_enums_1 = require("../performance/enums/performance.enums");
const notification_log_service_1 = require("../time-management/services/notification-log.service");
let PerformanceService = class PerformanceService {
    appraisalTemplateModel;
    appraisalCycleModel;
    appraisalAssignmentModel;
    appraisalRecordModel;
    appraisalDisputeModel;
    departmentModel;
    employeeProfileModel;
    notificationLogService;
    constructor(appraisalTemplateModel, appraisalCycleModel, appraisalAssignmentModel, appraisalRecordModel, appraisalDisputeModel, departmentModel, employeeProfileModel, notificationLogService) {
        this.appraisalTemplateModel = appraisalTemplateModel;
        this.appraisalCycleModel = appraisalCycleModel;
        this.appraisalAssignmentModel = appraisalAssignmentModel;
        this.appraisalRecordModel = appraisalRecordModel;
        this.appraisalDisputeModel = appraisalDisputeModel;
        this.departmentModel = departmentModel;
        this.employeeProfileModel = employeeProfileModel;
        this.notificationLogService = notificationLogService;
    }
    toObjectId(value) {
        if (!value)
            return undefined;
        if (value instanceof mongoose_2.Types.ObjectId)
            return value;
        try {
            return new mongoose_2.Types.ObjectId(value);
        }
        catch {
            return undefined;
        }
    }
    async createDispute(dto) {
        const appraisalId = this.toObjectId(dto.appraisalId);
        const assignmentId = this.toObjectId(dto.assignmentId);
        const cycleId = this.toObjectId(dto.cycleId);
        const employeeId = this.toObjectId(dto.raisedByEmployeeId);
        await this.appraisalCycleModel.updateOne({ _id: cycleId }, {
            $set: {
                "templateAssignments.0.templateId": this.toObjectId(dto.templateId),
                "templateAssignments.0.departmentIds.0": this.toObjectId(dto.departmentId)
            }
        });
        const dispute = new this.appraisalDisputeModel({
            appraisalId,
            assignmentId,
            cycleId,
            raisedByEmployeeId: employeeId,
            reason: dto.reason,
            details: dto.details,
        });
        return dispute.save();
    }
    async createAppraisalTemplate(createTemplateDto) {
        const template = new this.appraisalTemplateModel(createTemplateDto);
        return await template.save();
    }
    async getAllAppraisalTemplates() {
        return await this.appraisalTemplateModel
            .find({ isActive: true })
            .exec();
    }
    async getAppraisalTemplateById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid template ID');
        }
        const template = await this.appraisalTemplateModel
            .findById(id)
            .exec();
        if (!template) {
            throw new common_1.NotFoundException('Appraisal template not found');
        }
        return template;
    }
    async updateAppraisalTemplate(id, updateTemplateDto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid template ID');
        }
        const template = await this.appraisalTemplateModel
            .findByIdAndUpdate(id, updateTemplateDto, { new: true })
            .exec();
        if (!template) {
            throw new common_1.NotFoundException('Appraisal template not found');
        }
        return template;
    }
    async createAppraisalCycle(createCycleDto) {
        if (new Date(createCycleDto.startDate) >= new Date(createCycleDto.endDate)) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const cycle = new this.appraisalCycleModel(createCycleDto);
        return await cycle.save();
    }
    async getAllAppraisalCycles() {
        return await this.appraisalCycleModel
            .find()
            .sort({ startDate: -1 })
            .exec();
    }
    async getAppraisalCycleById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid cycle ID');
        }
        return await this.appraisalCycleModel
            .findById(id)
            .exec();
    }
    async updateAppraisalCycleStatus(id, status) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Invalid cycle ID');
        }
        const updateData = { status };
        if (status === performance_enums_1.AppraisalCycleStatus.ACTIVE) {
            updateData.publishedAt = new Date();
        }
        else if (status === performance_enums_1.AppraisalCycleStatus.CLOSED) {
            updateData.closedAt = new Date();
        }
        else if (status === performance_enums_1.AppraisalCycleStatus.ARCHIVED) {
            updateData.archivedAt = new Date();
        }
        const cycle = await this.appraisalCycleModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!cycle) {
            throw new common_1.NotFoundException('Appraisal cycle not found');
        }
        return cycle;
    }
    async getAppraisalAssignmentsByCycle(cycleId) {
        if (!mongoose_2.Types.ObjectId.isValid(cycleId)) {
            throw new common_1.NotFoundException('Invalid cycle ID');
        }
        return await this.appraisalAssignmentModel
            .find({ cycleId })
            .populate('employeeProfileId', 'firstName lastName position')
            .populate('managerProfileId', 'firstName lastName')
            .populate('templateId', 'name templateType')
            .populate('departmentId', 'name')
            .exec();
    }
    async createAppraisalAssignments(cycleId) {
        if (!mongoose_2.Types.ObjectId.isValid(cycleId)) {
            throw new common_1.NotFoundException('Invalid cycle ID');
        }
        const cycle = await this.appraisalCycleModel
            .findById(cycleId)
            .exec();
        if (!cycle) {
            throw new common_1.NotFoundException('Appraisal cycle not found');
        }
        if (!cycle.templateAssignments || cycle.templateAssignments.length === 0) {
            throw new common_1.BadRequestException('Cycle has no template assignments');
        }
        const templateId = cycle.templateAssignments[0].templateId;
        const departmentId = cycle.templateAssignments[0].departmentIds[0];
        const createdAssignments = [];
        const EmployeeProfileModel = this.appraisalAssignmentModel.db.model('EmployeeProfile');
        const employees = await EmployeeProfileModel.find({});
        for (const emp of employees) {
            const existing = await this.appraisalAssignmentModel.findOne({
                cycleId,
                employeeProfileId: emp._id,
            });
            if (existing)
                continue;
            const newAssignment = new this.appraisalAssignmentModel({
                cycleId,
                templateId,
                employeeProfileId: emp._id,
                managerProfileId: emp._id,
                departmentId,
                status: performance_enums_1.AppraisalAssignmentStatus.NOT_STARTED,
                assignedAt: new Date(),
            });
            const saved = await newAssignment.save();
            createdAssignments.push(saved);
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(emp._id.toString()),
                type: 'Performance Appraisal Assignment',
                message: `You have been assigned a new performance appraisal for cycle: ${cycle.name}. Your manager will evaluate your performance.`,
            });
        }
        return createdAssignments;
    }
    async getEmployeeAppraisals(employeeProfileId) {
        if (!mongoose_2.Types.ObjectId.isValid(employeeProfileId)) {
            throw new common_1.NotFoundException('Invalid employee profile ID');
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
    async getManagerAppraisalAssignments(managerProfileId) {
        if (!mongoose_2.Types.ObjectId.isValid(managerProfileId)) {
            throw new common_1.NotFoundException('Invalid manager profile ID');
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
    async getAppraisalAssignmentById(assignmentId) {
        if (!mongoose_2.Types.ObjectId.isValid(assignmentId)) {
            throw new common_1.NotFoundException('Invalid assignment ID');
        }
        const assignment = await this.appraisalAssignmentModel
            .findById(assignmentId)
            .populate('employeeProfileId', 'firstName lastName position departmentId')
            .populate('managerProfileId', 'firstName lastName')
            .populate('templateId', 'name templateType evaluationCriteria')
            .populate('cycleId', 'name startDate endDate status')
            .populate('departmentId', 'name')
            .exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Appraisal assignment not found');
        }
        return assignment;
    }
    async updateAppraisalAssignmentStatus(assignmentId, status) {
        if (!mongoose_2.Types.ObjectId.isValid(assignmentId)) {
            throw new common_1.NotFoundException('Invalid assignment ID');
        }
        const assignment = await this.appraisalAssignmentModel
            .findByIdAndUpdate(assignmentId, { status }, { new: true })
            .exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Appraisal assignment not found');
        }
        return assignment;
    }
    async createOrUpdateAppraisalRecord(assignmentId, createRecordDto) {
        if (!mongoose_2.Types.ObjectId.isValid(assignmentId)) {
            throw new common_1.NotFoundException('Invalid assignment ID');
        }
        const assignment = await this.appraisalAssignmentModel.findById(assignmentId).exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Appraisal assignment not found');
        }
        let totalScore = 0;
        if (createRecordDto.ratings && createRecordDto.ratings.length > 0) {
            totalScore = createRecordDto.ratings.reduce((sum, rating) => {
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
            status: performance_enums_1.AppraisalRecordStatus.DRAFT,
        };
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
    async submitAppraisalRecord(assignmentId) {
        if (!mongoose_2.Types.ObjectId.isValid(assignmentId)) {
            throw new common_1.NotFoundException('Invalid assignment ID');
        }
        const record = await this.appraisalRecordModel.findOne({ assignmentId })
            .populate('employeeProfileId')
            .exec();
        if (!record) {
            throw new common_1.NotFoundException('Appraisal record not found');
        }
        record.status = performance_enums_1.AppraisalRecordStatus.MANAGER_SUBMITTED;
        record.managerSubmittedAt = new Date();
        await record.save();
        await this.appraisalAssignmentModel
            .findByIdAndUpdate(assignmentId, {
            status: performance_enums_1.AppraisalAssignmentStatus.SUBMITTED,
            submittedAt: new Date(),
            latestAppraisalId: record._id,
        })
            .exec();
        const hrAdmins = await this.employeeProfileModel.find({
            systemRoles: { $in: ['HR Admin', 'HR Manager'] }
        }).exec();
        for (const hrAdmin of hrAdmins) {
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(hrAdmin._id.toString()),
                type: 'Performance Appraisal Submitted',
                message: `Manager has submitted performance appraisal for employee. Ready for HR review and publishing.`,
            });
        }
        return record;
    }
    async publishAppraisalRecord(assignmentId, publishedByEmployeeId) {
        if (!mongoose_2.Types.ObjectId.isValid(assignmentId)) {
            throw new common_1.NotFoundException('Invalid assignment ID');
        }
        const record = await this.appraisalRecordModel.findOne({ assignmentId })
            .populate('employeeProfileId')
            .populate('cycleId')
            .exec();
        if (!record) {
            throw new common_1.NotFoundException('Appraisal record not found');
        }
        record.status = performance_enums_1.AppraisalRecordStatus.HR_PUBLISHED;
        record.hrPublishedAt = new Date();
        record.publishedByEmployeeId = new mongoose_2.Types.ObjectId(publishedByEmployeeId);
        await record.save();
        await this.appraisalAssignmentModel
            .findByIdAndUpdate(assignmentId, {
            status: performance_enums_1.AppraisalAssignmentStatus.PUBLISHED,
            publishedAt: new Date(),
        })
            .exec();
        await this.employeeProfileModel.findByIdAndUpdate(record.employeeProfileId, {
            $push: {
                appraisalHistory: {
                    appraisalId: record._id,
                    cycleId: record.cycleId,
                    totalScore: record.totalScore,
                    appraisalDate: record.hrPublishedAt,
                    status: record.status,
                }
            }
        }).exec();
        await this.notificationLogService.sendNotification({
            to: new mongoose_2.Types.ObjectId(record.employeeProfileId.toString()),
            type: 'Performance Appraisal Published',
            message: `Your performance appraisal has been published. Total score: ${record.totalScore}. You have 7 days to raise objections if needed.`,
        });
        return record;
    }
    async getAppraisalRecordById(recordId) {
        if (!mongoose_2.Types.ObjectId.isValid(recordId)) {
            throw new common_1.NotFoundException('Invalid record ID');
        }
        const record = await this.appraisalRecordModel
            .findById(recordId)
            .populate('assignmentId')
            .populate('cycleId', 'name cycleType')
            .populate('templateId', 'name templateType')
            .populate('employeeProfileId', 'firstName lastName position')
            .populate('managerProfileId', 'firstName lastName')
            .populate('publishedByEmployeeId', 'firstName lastName')
            .exec();
        if (!record) {
            throw new common_1.NotFoundException('Appraisal record not found');
        }
        return record;
    }
    async updateAppraisalRecordStatus(recordId, status) {
        if (!mongoose_2.Types.ObjectId.isValid(recordId)) {
            throw new common_1.NotFoundException('Invalid record ID');
        }
        const record = await this.appraisalRecordModel
            .findByIdAndUpdate(recordId, { status }, { new: true })
            .exec();
        if (!record) {
            throw new common_1.NotFoundException('Appraisal record not found');
        }
        return record;
    }
    async createAppraisalDispute(createDisputeDto) {
        const requiredIds = [
            "appraisalId",
            "assignmentId",
            "cycleId",
            "raisedByEmployeeId"
        ];
        for (const field of requiredIds) {
            if (!createDisputeDto[field]) {
                throw new common_1.BadRequestException(`${field} is required`);
            }
            if (!mongoose_2.Types.ObjectId.isValid(createDisputeDto[field])) {
                throw new common_1.BadRequestException(`${field} is not a valid ObjectId`);
            }
        }
        const appraisal = await this.appraisalRecordModel.findById(createDisputeDto.appraisalId).exec();
        if (appraisal && appraisal.hrPublishedAt) {
            const daysSincePublished = Math.floor((new Date().getTime() - appraisal.hrPublishedAt.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSincePublished > 7) {
                throw new common_1.BadRequestException('Objection period has expired. Disputes must be raised within 7 days of publication.');
            }
        }
        const _id = new mongoose_2.Types.ObjectId();
        const dto = {
            _id,
            appraisalId: new mongoose_2.Types.ObjectId(createDisputeDto.appraisalId),
            assignmentId: new mongoose_2.Types.ObjectId(createDisputeDto.assignmentId),
            cycleId: new mongoose_2.Types.ObjectId(createDisputeDto.cycleId),
            raisedByEmployeeId: new mongoose_2.Types.ObjectId(createDisputeDto.raisedByEmployeeId),
            reason: createDisputeDto.reason,
            details: createDisputeDto.details,
            status: performance_enums_1.AppraisalDisputeStatus.OPEN,
            submittedAt: new Date()
        };
        const dispute = new this.appraisalDisputeModel(dto);
        const savedDispute = await dispute.save();
        const hrAdmins = await this.employeeProfileModel.find({
            systemRoles: { $in: ['HR Admin', 'HR Manager'] }
        }).exec();
        for (const hrAdmin of hrAdmins) {
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(hrAdmin._id.toString()),
                type: 'Performance Appraisal Dispute',
                message: `New performance appraisal dispute raised. Reason: ${createDisputeDto.reason}. Please review and resolve.`,
            });
        }
        return savedDispute;
    }
    async getAppraisalDisputes(cycleId) {
        const query = {};
        if (cycleId && mongoose_2.Types.ObjectId.isValid(cycleId)) {
            query.cycleId = new mongoose_2.Types.ObjectId(cycleId);
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
    async updateDisputeStatus(disputeId, status, resolutionData) {
        if (!mongoose_2.Types.ObjectId.isValid(disputeId)) {
            throw new common_1.NotFoundException('Invalid dispute ID');
        }
        const _id = new mongoose_2.Types.ObjectId(disputeId);
        const updateData = { status };
        if (status === performance_enums_1.AppraisalDisputeStatus.ADJUSTED ||
            status === performance_enums_1.AppraisalDisputeStatus.REJECTED) {
            updateData.resolvedAt = new Date();
            if (resolutionData?.resolvedByEmployeeId &&
                mongoose_2.Types.ObjectId.isValid(resolutionData.resolvedByEmployeeId)) {
                updateData.resolvedByEmployeeId = new mongoose_2.Types.ObjectId(resolutionData.resolvedByEmployeeId);
            }
            if (resolutionData?.resolutionSummary) {
                updateData.resolutionSummary = resolutionData.resolutionSummary;
            }
        }
        const dispute = await this.appraisalDisputeModel
            .findOneAndUpdate({ _id }, updateData, { new: true })
            .populate('raisedByEmployeeId')
            .exec();
        if (!dispute) {
            throw new common_1.NotFoundException('Appraisal dispute not found');
        }
        if (status === performance_enums_1.AppraisalDisputeStatus.ADJUSTED || status === performance_enums_1.AppraisalDisputeStatus.REJECTED) {
            await this.notificationLogService.sendNotification({
                to: new mongoose_2.Types.ObjectId(dispute.raisedByEmployeeId.toString()),
                type: 'Performance Appraisal Dispute Resolved',
                message: `Your performance appraisal dispute has been ${status.toLowerCase()}. ${resolutionData?.resolutionSummary || ''}`,
            });
        }
        return dispute;
    }
    async getAppraisalDisputeById(disputeId) {
        let id;
        try {
            id = new mongoose_2.Types.ObjectId(disputeId);
        }
        catch {
            throw new common_1.NotFoundException('Invalid dispute ID');
        }
        const dispute = await this.appraisalDisputeModel
            .findOne({ _id: id })
            .populate('appraisalId')
            .populate('assignmentId')
            .populate('cycleId', 'name cycleType')
            .populate('raisedByEmployeeId', 'firstName lastName')
            .populate('assignedReviewerEmployeeId', 'firstName lastName')
            .populate('resolvedByEmployeeId', 'firstName lastName')
            .exec();
        if (!dispute) {
            throw new common_1.NotFoundException('Appraisal dispute not found');
        }
        return dispute;
    }
    async assignDisputeReviewer(disputeId, reviewerId) {
        if (!mongoose_2.Types.ObjectId.isValid(disputeId)) {
            throw new common_1.NotFoundException('Invalid dispute ID');
        }
        if (!mongoose_2.Types.ObjectId.isValid(reviewerId)) {
            throw new common_1.NotFoundException('Invalid reviewer ID');
        }
        const _id = new mongoose_2.Types.ObjectId(disputeId);
        const reviewer = new mongoose_2.Types.ObjectId(reviewerId);
        const dispute = await this.appraisalDisputeModel
            .findOneAndUpdate({ _id }, {
            assignedReviewerEmployeeId: reviewer,
            status: performance_enums_1.AppraisalDisputeStatus.UNDER_REVIEW
        }, { new: true })
            .exec();
        if (!dispute) {
            throw new common_1.NotFoundException('Appraisal dispute not found');
        }
        return dispute;
    }
    async getPerformanceAnalytics(cycleId) {
        const query = {};
        if (cycleId && mongoose_2.Types.ObjectId.isValid(cycleId)) {
            query.cycleId = new mongoose_2.Types.ObjectId(cycleId);
        }
        const assignments = await this.appraisalAssignmentModel.find(query).exec();
        const records = await this.appraisalRecordModel.find(query).exec();
        const totalAssignments = assignments.length;
        const completedAssignments = assignments.filter(a => a.status === performance_enums_1.AppraisalAssignmentStatus.PUBLISHED).length;
        const inProgressAssignments = assignments.filter(a => a.status === performance_enums_1.AppraisalAssignmentStatus.IN_PROGRESS ||
            a.status === performance_enums_1.AppraisalAssignmentStatus.SUBMITTED).length;
        const notStartedAssignments = assignments.filter(a => a.status === performance_enums_1.AppraisalAssignmentStatus.NOT_STARTED).length;
        const completionRate = totalAssignments > 0 ?
            (completedAssignments / totalAssignments * 100).toFixed(2) : 0;
        const averageScore = records.length > 0 ?
            (records.reduce((sum, r) => sum + (r.totalScore || 0), 0) / records.length).toFixed(2) : 0;
        return {
            totalAssignments,
            completedAssignments,
            inProgressAssignments,
            notStartedAssignments,
            completionRate: `${completionRate}%`,
            averageScore,
            totalRecords: records.length,
        };
    }
    async getDepartmentPerformanceAnalytics(departmentId, cycleId) {
        if (!mongoose_2.Types.ObjectId.isValid(departmentId)) {
            throw new common_1.BadRequestException('Invalid department ID');
        }
        const query = { departmentId: new mongoose_2.Types.ObjectId(departmentId) };
        if (cycleId && mongoose_2.Types.ObjectId.isValid(cycleId)) {
            query.cycleId = new mongoose_2.Types.ObjectId(cycleId);
        }
        const assignments = await this.appraisalAssignmentModel.find(query)
            .populate('employeeProfileId', 'firstName lastName')
            .exec();
        const records = await this.appraisalRecordModel.find(query).exec();
        const totalEmployees = assignments.length;
        const completedEvaluations = assignments.filter(a => a.status === performance_enums_1.AppraisalAssignmentStatus.PUBLISHED).length;
        const completionRate = totalEmployees > 0 ?
            (completedEvaluations / totalEmployees * 100).toFixed(2) : 0;
        const averageScore = records.length > 0 ?
            (records.reduce((sum, r) => sum + (r.totalScore || 0), 0) / records.length).toFixed(2) : 0;
        return {
            departmentId,
            totalEmployees,
            completedEvaluations,
            pendingEvaluations: totalEmployees - completedEvaluations,
            completionRate: `${completionRate}%`,
            averageScore,
            assignments: assignments.map(a => ({
                employeeId: a.employeeProfileId?._id,
                employeeName: a.employeeProfileId ?
                    `${a.employeeProfileId.firstName} ${a.employeeProfileId.lastName}` : 'N/A',
                status: a.status,
                assignedAt: a.assignedAt,
                completedAt: a.publishedAt,
            })),
        };
    }
    async getHistoricalTrendAnalysis(employeeProfileId) {
        const query = { status: performance_enums_1.AppraisalRecordStatus.HR_PUBLISHED };
        if (employeeProfileId && mongoose_2.Types.ObjectId.isValid(employeeProfileId)) {
            query.employeeProfileId = new mongoose_2.Types.ObjectId(employeeProfileId);
        }
        const records = await this.appraisalRecordModel.find(query)
            .populate('cycleId', 'name cycleType startDate endDate')
            .populate('employeeProfileId', 'firstName lastName')
            .sort({ hrPublishedAt: 1 })
            .exec();
        const trends = records.map(record => ({
            employeeId: record.employeeProfileId?._id,
            employeeName: record.employeeProfileId ?
                `${record.employeeProfileId.firstName} ${record.employeeProfileId.lastName}` : 'N/A',
            cycleName: record.cycleId?.name || 'N/A',
            cycleType: record.cycleId?.cycleType || 'N/A',
            totalScore: record.totalScore,
            publishedDate: record.hrPublishedAt,
        }));
        return {
            totalRecords: records.length,
            trends,
        };
    }
    async exportPerformanceReport(cycleId) {
        const query = {};
        if (cycleId && mongoose_2.Types.ObjectId.isValid(cycleId)) {
            query.cycleId = new mongoose_2.Types.ObjectId(cycleId);
        }
        const records = await this.appraisalRecordModel.find(query)
            .populate('cycleId', 'name cycleType startDate endDate')
            .populate('employeeProfileId', 'firstName lastName position departmentId')
            .populate('managerProfileId', 'firstName lastName')
            .populate('templateId', 'name templateType')
            .sort({ hrPublishedAt: -1 })
            .exec();
        const reportData = records.map(record => ({
            employeeName: record.employeeProfileId ?
                `${record.employeeProfileId.firstName} ${record.employeeProfileId.lastName}` : 'N/A',
            position: record.employeeProfileId?.position || 'N/A',
            managerName: record.managerProfileId ?
                `${record.managerProfileId.firstName} ${record.managerProfileId.lastName}` : 'N/A',
            cycleName: record.cycleId?.name || 'N/A',
            cycleType: record.cycleId?.cycleType || 'N/A',
            templateName: record.templateId?.name || 'N/A',
            totalScore: record.totalScore,
            status: record.status,
            managerSubmittedAt: record.managerSubmittedAt,
            hrPublishedAt: record.hrPublishedAt,
            ratings: record.ratings,
            managerSummary: record.managerSummary,
            strengths: record.strengths,
            improvementAreas: record.improvementAreas,
        }));
        return {
            generatedAt: new Date(),
            totalRecords: reportData.length,
            cycleId: cycleId || 'All Cycles',
            data: reportData,
        };
    }
};
exports.PerformanceService = PerformanceService;
exports.PerformanceService = PerformanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appraisal_template_schema_1.AppraisalTemplate.name)),
    __param(1, (0, mongoose_1.InjectModel)(appraisal_cycle_schema_1.AppraisalCycle.name)),
    __param(2, (0, mongoose_1.InjectModel)(appraisal_assignment_schema_1.AppraisalAssignment.name)),
    __param(3, (0, mongoose_1.InjectModel)(appraisal_record_schema_1.AppraisalRecord.name)),
    __param(4, (0, mongoose_1.InjectModel)(appraisal_dispute_schema_1.AppraisalDispute.name)),
    __param(5, (0, mongoose_1.InjectModel)(department_schema_1.Department.name)),
    __param(6, (0, mongoose_1.InjectModel)(employee_profile_schema_1.EmployeeProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notification_log_service_1.NotificationLogService])
], PerformanceService);
//# sourceMappingURL=performance.service.js.map