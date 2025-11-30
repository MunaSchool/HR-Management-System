import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeRoleService } from './services/employee-role.service';
import { CandidateRegistrationService } from './services/candidate-registration.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type  { CurrentUserData } from '../auth/decorators/current-user.decorator';

import { SystemRole, EmployeeStatus } from './enums/employee-profile.enums';

import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ProcessChangeRequestDto } from './dto/process-change-request.dto';
import { UpdateEmployeeMasterDto } from './dto/update-employee-master.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employee-profile')
export class EmployeeProfileController {
  constructor(
    private readonly employeeProfileService: EmployeeProfileService,
    private readonly employeeRoleService: EmployeeRoleService,
    private readonly candidateRegistrationService: CandidateRegistrationService,
  ) {}

  // ==================== CANDIDATE REGISTRATION (PUBLIC) ====================

  /**
   * Public endpoint - Register a new candidate
   * No authentication required
   */
  @Post('candidate/register')
  async registerCandidate(@Body() registerDto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }) {
    return this.candidateRegistrationService.registerCandidate(registerDto);
  }

  /**
   * Protected endpoint - Get candidate profile
   */
  @Get('candidate/profile')
  @UseGuards(AuthGuard)
  async getCandidateProfile(@CurrentUser() user: CurrentUserData) {
    return this.candidateRegistrationService.getCandidateProfile(user.employeeId);
  }

  /**
   * Protected endpoint - Update candidate profile
   */
  @Put('candidate/profile')
  @UseGuards(AuthGuard)
  async updateCandidateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: any,
  ) {
    return this.candidateRegistrationService.updateCandidateProfile(user.employeeId, updateDto);
  }

  /**
   * Protected endpoint - Change candidate password
   */
  @Put('candidate/change-password')
  @UseGuards(AuthGuard)
  async changeCandidatePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() passwordDto: { currentPassword: string; newPassword: string },
  ) {
    return this.candidateRegistrationService.changePassword(
      user.employeeId,
      passwordDto.currentPassword,
      passwordDto.newPassword,
    );
  }

  // ==================== BASIC CRUD ====================

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getAllEmployees(@CurrentUser() user: CurrentUserData) {
    return this.employeeProfileService.findAll();
  }

  @Get('search')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async searchEmployees(
    @Query('q') searchQuery?: string,
    @Query('status') status?: EmployeeStatus,
    @Query('departmentId') departmentId?: string,
  ) {
    return this.employeeProfileService.searchEmployees(
      searchQuery || '',
      status,
      departmentId,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getEmployeeById(
    @Param('id') id: string,
  ) {
    return this.employeeProfileService.getMyProfile(id);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN)
  async createEmployee(
    @CurrentUser() user: CurrentUserData,
    @Body() employeeData: CreateEmployeeDto,
  ) {
    return this.employeeProfileService.create(employeeData);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async updateEmployeeMasterData(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() updateDto: UpdateEmployeeMasterDto,
  ) {
    return this.employeeProfileService.updateEmployeeMasterData(
      id,
      user.userId,
      user.roles?.[0] || '',
      updateDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.SYSTEM_ADMIN)
  async deleteEmployee(@Param('id') id: string) {
    return this.employeeProfileService.delete(id);
  }

  // ==================== SELF SERVICE ====================


  @Get('me')
  @UseGuards(AuthGuard)
  async getMyProfile(@CurrentUser() user: CurrentUserData) {
    return this.employeeProfileService.getMyProfile(user.employeeId);
  }

  @Patch('me/contact-info')
  @UseGuards(AuthGuard)
  async updateMyContactInfo(
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateContactInfoDto,
  ) {
    return this.employeeProfileService.updateMyContactInfo(
      user.employeeId,
      user.userId,
      updateDto,
    );
  }

  @Patch('me/profile')
  @UseGuards(AuthGuard)
  async updateMyProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.employeeProfileService.updateMyProfile(
      user.employeeId,
      user.userId,
      updateDto,
    );
  }

  @Post('me/change-requests')
  @UseGuards(AuthGuard)
  async createChangeRequest(
    @CurrentUser() user: CurrentUserData,
    @Body() createDto: CreateChangeRequestDto,
  ) {
    return this.employeeProfileService.createChangeRequest(
      user.employeeId,
      user.userId,
      createDto,
    );
  }

  @Get('me/change-requests')
  @UseGuards(AuthGuard)
  async getMyChangeRequests(@CurrentUser() user: CurrentUserData) {
    return this.employeeProfileService.getMyChangeRequests(user.employeeId);
  }

  @Post('me/profile-picture')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = await this.employeeProfileService.saveFile(file, user.employeeId);

    const profile = await this.employeeProfileService.getMyProfile(user.employeeId);

    if (profile.profilePictureUrl) {
      await this.employeeProfileService.deleteFile(profile.profilePictureUrl);
    }

    await this.employeeProfileService.updateMyProfile(user.employeeId, user.userId, {
      profilePictureUrl: fileUrl,
    });

    return { message: 'Profile picture uploaded successfully', url: fileUrl };
  }

  @Get('profile-picture/:filename')
  async getProfilePicture(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.employeeProfileService.getFile(filename);
    res.send(file);
  }

  // ==================== MANAGER ENDPOINTS ====================

  @Get('team')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.DEPARTMENT_HEAD)
  async getTeamMembers(@CurrentUser() user: CurrentUserData) {
    const managerPositionId = user['managerPositionId'] || user.employeeId;
    return this.employeeProfileService.getTeamMembers(managerPositionId);
  }

  @Get('team/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.DEPARTMENT_HEAD)
  async getTeamMemberProfile(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    const managerPositionId = user['managerPositionId'] || user.employeeId;
    return this.employeeProfileService.getTeamMemberProfile(id, managerPositionId);
  }

  // ==================== HR ADMIN ====================

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async updateEmployeeStatus(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() statusDto: { status: EmployeeStatus; effectiveDate?: Date },
  ) {
    return this.employeeProfileService.deactivateEmployee(
      id,
      user.userId,
      user.roles?.[0] || '',
      statusDto.status,
      statusDto.effectiveDate,
    );
  }

  // ==================== CHANGE REQUEST MANAGEMENT ====================

  @Get('change-requests/pending')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getPendingChangeRequests() {
    return this.employeeProfileService.getPendingChangeRequests();
  }

  @Get('change-requests/:requestId')
  @UseGuards(AuthGuard)
  async getChangeRequestById(@Param('requestId') requestId: string) {
    return this.employeeProfileService.getChangeRequestById(requestId);
  }

  @Patch('change-requests/:requestId/process')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async processChangeRequest(
    @CurrentUser() user: CurrentUserData,
    @Param('requestId') requestId: string,
    @Body() processDto: ProcessChangeRequestDto,
  ) {
    return this.employeeProfileService.processChangeRequest(
      requestId,
      user.userId,
      user.roles?.[0] || '',
      processDto,
    );
  }

  // ==================== ROLE MANAGEMENT ====================

  @Post(':id/roles/assign')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN)
  async assignRoles(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return await this.employeeRoleService.assignRolesToEmployee(
      id,
      assignRoleDto,
      user.userId,
      user.roles?.[0] || '',
    );
  }

  @Get(':id/roles')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getEmployeeRoles(@Param('id') id: string) {
    return await this.employeeRoleService.getEmployeeRoles(id);
  }

  @Get('roles/by-role/:role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getEmployeesByRole(@Param('role') role: SystemRole) {
    return await this.employeeRoleService.getEmployeesByRole(role);
  }

  @Delete(':id/roles/remove')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN)
  async removeRoles(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
  ) {
    return await this.employeeRoleService.removeRolesFromEmployee(
      id,
      user.userId,
      user.roles?.[0] || '',
    );
  }

  @Patch(':id/permissions/add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN)
  async addPermission(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body('permission') permission: string,
  ) {
    return await this.employeeRoleService.addPermissionToEmployee(
      id,
      permission,
      user.userId,
      user.roles?.[0] || '',
    );
  }

  @Patch(':id/permissions/remove')
  @Roles(SystemRole.HR_ADMIN, SystemRole.SYSTEM_ADMIN)
  async removePermission(
    @CurrentUser() user: CurrentUserData,
    @Param('id') id: string,
    @Body('permission') permission: string,
  ) {
    return await this.employeeRoleService.removePermissionFromEmployee(
      id,
      permission,
      user.userId,
      user.roles?.[0] || '',
    );
  }

  @Get('roles/all')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  async getAllRoleAssignments(@CurrentUser() user: CurrentUserData) {
    return await this.employeeRoleService.getAllRoleAssignments(
      user.roles?.[0] || '',
    );
  }
}
