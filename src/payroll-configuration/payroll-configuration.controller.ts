import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

import { PayrollConfigurationService } from './payroll-configuration.service';

import { updatePayrollPoliciesDto } from './dto/update-policies.dto';
import { createPayrollPoliciesDto } from './dto/create-policies.dto';
import { createAllowanceDto } from './dto/create-allowance.dto';
import { createResigAndTerminBenefitsDTO } from './dto/create-resigAndTerm.dto';
import { addPayGradeDTO } from './dto/create-paygrade.dto';
import { editPayGradeDTO } from './dto/edit-paygrade.dto';
import { editPayTypeDTO } from './dto/edit-paytype.dto';
import { createPayTypeDTO } from './dto/create-paytype.dto';
import { editsigningBonusDTO } from './dto/edit-signingBonus.dto';
import { createsigningBonusesDTO } from './dto/create-signingBonus.dto';
import { createInsuranceBracketsDTO } from './dto/create-insurance.dto';
import { editInsuranceBracketsDTO } from './dto/edit-insurance.dto';
import { payrollPoliciesDocument } from './models/payrollPolicies.schema';
import { CreateCompanySettingsDto } from './dto/create-company-settings.dto';
import { UpdateCompanySettingsDto } from './dto/UpdateCompanySettings.dto';
import { ApprovalDto } from './dto/approval.dto';

@Controller('payroll-configuration')
export class PayrollConfigurationController {
  constructor(
    private readonly payrollConfigurationService: PayrollConfigurationService,
  ) {}

  // -------------------
  // PAYROLL SPECIALIST ROUTES
  // -------------------

  @Get('policies')
  async getAllPolicies(): Promise<payrollPoliciesDocument[]> {
    return this.payrollConfigurationService.findAllPolicies();
  }

  @Get('policies/:id')
  async getPolicyById(@Param('id') id: string): Promise<payrollPoliciesDocument | null> {
    return this.payrollConfigurationService.findById(id);
  }

  @Post('policies')
  async createPolicy(@Body() policyData: createPayrollPoliciesDto): Promise<payrollPoliciesDocument> {
    return this.payrollConfigurationService.createPolicy(policyData);
  }

  @Put('policies/:id')
  async updatePolicy(
    @Param('id') id: string,
    @Body() updateData: updatePayrollPoliciesDto
  ): Promise<payrollPoliciesDocument | null> {
    return this.payrollConfigurationService.updatePolicy(id, updateData);
  }

  @Delete('policies/:id')
  async deletePolicy(@Param('id') id: string): Promise<payrollPoliciesDocument | null> {
    return this.payrollConfigurationService.deletePolicy(id);
  }

  // -------------------
  // INSURANCE BRACKETS
  // -------------------

  @Get('insurance-brackets/:id')
  async findInsuranceBracket(@Param('id') id: string) {
    return this.payrollConfigurationService.findInsuranceBrackets(id);
  }

  @Post('insurance-brackets')
  async createInsuranceBracket(@Body() bracketData: createInsuranceBracketsDTO) {
    return this.payrollConfigurationService.createInsuranceBrackets(bracketData);
  }

  @Put('insurance-brackets/:id')
  async editInsuranceBracket(
    @Param('id') id: string,
    @Body() updateData: editInsuranceBracketsDTO
  ) {
    return this.payrollConfigurationService.editInsuranceBrackets(id, updateData);
  }

  @Delete('insurance-brackets/:id')
  async removeInsuranceBracket(@Param('id') id: string) {
    return this.payrollConfigurationService.removeInsuranceBrackets(id);
  }

  // -------------------
  // PAYROLL MANAGER APPROVAL
  // -------------------

  @Post('approve/payroll/:model/:id')
  async approvePayrollConfig(
    @Param('model') model: string,
    @Param('id') id: string,
  ) {
    return this.payrollConfigurationService.payrollManagerApprove(model, id);
  }

  @Post('reject/payroll/:model/:id')
  async rejectPayrollConfig(
    @Param('model') model: string,
    @Param('id') id: string,
  ) {
    return this.payrollConfigurationService.payrollManagerReject(model, id);
  }

  // -------------------
  // HR MANAGER INSURANCE APPROVAL
  // -------------------

  @Post('approve/insurance/:id')
  async approveInsurance(@Param('id') id: string) {
    return this.payrollConfigurationService.hrApproveInsurance(id);
  }

  @Post('reject/insurance/:id')
  async rejectInsurance(@Param('id') id: string) {
    return this.payrollConfigurationService.hrRejectInsurance(id);
  }

  // -------------------
  // COMPANY SETTINGS (SYSTEM ADMIN)
  // -------------------

  @Post('company-settings')
  createSettings(@Body() dto: CreateCompanySettingsDto) {
    return this.payrollConfigurationService.create(dto);
  }

  @Get('company-settings')
  getAllSettings() {
    return this.payrollConfigurationService.findAll();
  }

  @Get('company-settings/:id')
  getSettings(@Param('id') id: string) {
    return this.payrollConfigurationService.findOne(id);
  }

  @Put('company-settings/:id')
  updateSettings(@Param('id') id: string, @Body() dto: UpdateCompanySettingsDto) {
    return this.payrollConfigurationService.update(id, dto);
  }

  @Delete('company-settings/:id')
  deleteSettings(@Param('id') id: string) {
    return this.payrollConfigurationService.delete(id);
  }

  // -------------------
  // GENERAL APPROVAL/REJECTION
  // -------------------

  @Post('approval')
  approveOrReject(@Body() dto: ApprovalDto) {
    return this.payrollConfigurationService.approveOrReject(dto);
  }
}
