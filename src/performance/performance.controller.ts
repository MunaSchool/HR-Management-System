import {Controller, Get, Post, Put, Body, Param, Query, UsePipes, ValidationPipe} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { CreateAppraisalTemplateDto } from './dto/create-appraisal-template.dto';
import { CreateAppraisalCycleDto } from './dto/create-appraisal-cycle.dto';
import { CreateAppraisalRecordDto } from './dto/create-appraisal-record.dto';
import { CreateAppraisalDisputeDto } from './dto/create-appraisal-dispute.dto';
import { UpdateAppraisalDisputeDto } from './dto/update-appraisal-dispute.dto';
import { UpdateAppraisalCycleStatusDto } from './dto/update-appraisal-cycle-status.dto';
import { PublishAppraisalRecordDto } from './dto/publish-appraisal-record.dto';
import { AppraisalCycleStatus, AppraisalDisputeStatus } from './enums/performance.enums';

@Controller('performance')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  // APPRAISAL TEMPLATE ENDPOINTS
  @Post('templates')
  async createAppraisalTemplate(@Body() createTemplateDto: CreateAppraisalTemplateDto) {
    return this.performanceService.createAppraisalTemplate(createTemplateDto);
  }

  @Get('templates')
  async getAllAppraisalTemplates() {
    return this.performanceService.getAllAppraisalTemplates();
  }

  @Get('templates/:id')
  async getAppraisalTemplateById(@Param('id') id: string) {
    return this.performanceService.getAppraisalTemplateById(id);
  }

  @Put('templates/:id')
  async updateAppraisalTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: CreateAppraisalTemplateDto,
  ) {
    return this.performanceService.updateAppraisalTemplate(id, updateTemplateDto);
  }

  // APPRAISAL CYCLE ENDPOINTS
  @Post('cycles')
  async createAppraisalCycle(@Body() createCycleDto: CreateAppraisalCycleDto) {
    return this.performanceService.createAppraisalCycle(createCycleDto);
  }

  @Get('cycles')
  async getAllAppraisalCycles() {
    return this.performanceService.getAllAppraisalCycles();
  }

  @Get('cycles/:id')
  async getAppraisalCycleById(@Param('id') id: string) {
    return this.performanceService.getAppraisalCycleById(id);
  }

  @Put('cycles/:id/status')
  async updateAppraisalCycleStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAppraisalCycleStatusDto,
  ) {
    return this.performanceService.updateAppraisalCycleStatus(id, updateStatusDto.status);
  }

  // APPRAISAL ASSIGNMENT ENDPOINTS
  @Post('cycles/:cycleId/assignments')
  async createAppraisalAssignments(@Param('cycleId') cycleId: string) {
    return this.performanceService.createAppraisalAssignments(cycleId);
  }

  @Get('employees/:employeeProfileId/appraisals')
  async getEmployeeAppraisals(@Param('employeeProfileId') employeeProfileId: string) {
    return this.performanceService.getEmployeeAppraisals(employeeProfileId);
  }

  @Get('managers/:managerProfileId/assignments')
  async getManagerAppraisalAssignments(@Param('managerProfileId') managerProfileId: string) {
    return this.performanceService.getManagerAppraisalAssignments(managerProfileId);
  }

  // APPRAISAL RECORD ENDPOINTS
  @Post('assignments/:assignmentId/record')
  async createOrUpdateAppraisalRecord(
    @Param('assignmentId') assignmentId: string,
    @Body() createRecordDto: CreateAppraisalRecordDto,
  ) {
    return this.performanceService.createOrUpdateAppraisalRecord(assignmentId, createRecordDto);
  }

  @Put('assignments/:assignmentId/submit')
  async submitAppraisalRecord(@Param('assignmentId') assignmentId: string) {
    return this.performanceService.submitAppraisalRecord(assignmentId);
  }

  @Put('assignments/:assignmentId/publish')
  async publishAppraisalRecord(
    @Param('assignmentId') assignmentId: string,
    @Body() publishDto: PublishAppraisalRecordDto,
  ) {
    return this.performanceService.publishAppraisalRecord(assignmentId, publishDto.publishedByEmployeeId);
  }

  // APPRAISAL DISPUTE ENDPOINTS
  @Post('disputes')
  async createAppraisalDispute(@Body() createDisputeDto: CreateAppraisalDisputeDto) {
    return this.performanceService.createAppraisalDispute(createDisputeDto);
  }

  @Get('disputes')
  async getAppraisalDisputes(@Query('cycleId') cycleId?: string) {
    return this.performanceService.getAppraisalDisputes(cycleId);
  }

  @Put('disputes/:disputeId/status')
  async updateDisputeStatus(
    @Param('disputeId') disputeId: string,
    @Body() updateDisputeDto: UpdateAppraisalDisputeDto,
  ) {
    return this.performanceService.updateDisputeStatus(
      disputeId, 
      updateDisputeDto.status, 
      {
        resolvedByEmployeeId: updateDisputeDto.resolvedByEmployeeId,
        resolutionSummary: updateDisputeDto.resolutionSummary
      }
    );
  }

  // ADDITIONAL CONVENIENCE ENDPOINTS
  @Get('cycles/:cycleId/assignments')
  async getCycleAssignments(@Param('cycleId') cycleId: string) {
    return this.performanceService.getAppraisalAssignmentsByCycle(cycleId);
  }

  @Get('assignments/:assignmentId')
  async getAppraisalAssignment(@Param('assignmentId') assignmentId: string) {
    return this.performanceService.getAppraisalAssignmentById(assignmentId);
  }

  @Get('records/:recordId')
  async getAppraisalRecord(@Param('recordId') recordId: string) {
    return this.performanceService.getAppraisalRecordById(recordId);
  }

  @Get('disputes/:disputeId')
  async getAppraisalDispute(@Param('disputeId') disputeId: string) {
    return this.performanceService.getAppraisalDisputeById(disputeId);
  }

  // STATUS MANAGEMENT ENDPOINTS
  @Put('assignments/:assignmentId/status')
  async updateAssignmentStatus(
    @Param('assignmentId') assignmentId: string,
    @Body('status') status: string,
  ) {
    return this.performanceService.updateAppraisalAssignmentStatus(assignmentId, status);
  }

  @Put('records/:recordId/status')
  async updateRecordStatus(
    @Param('recordId') recordId: string,
    @Body('status') status: string,
  ) {
    return this.performanceService.updateAppraisalRecordStatus(recordId, status);
  }

  @Put('disputes/:disputeId/assign-reviewer')
  async assignDisputeReviewer(
    @Param('disputeId') disputeId: string,
    @Body('reviewerId') reviewerId: string,
  ) {
    return this.performanceService.assignDisputeReviewer(disputeId, reviewerId);
  }
}
