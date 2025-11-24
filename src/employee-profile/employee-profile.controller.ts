import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { EmployeeProfileService } from './employee-profile.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { CurrentUserData } from '../common/decorators/current-user.decorator';
import { SystemRole, EmployeeStatus } from './enums/employee-profile.enums';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ProcessChangeRequestDto } from './dto/process-change-request.dto';
import { UpdateEmployeeMasterDto } from './dto/update-employee-master.dto';

@Controller('employee-profile')
@ApiTags('Employee Profile Management')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeeProfileController {
  constructor(
    private readonly employeeProfileService: EmployeeProfileService,
  ) {}

  // ==================== EMPLOYEE SELF-SERVICE ENDPOINTS ====================

  @Get('me')
  @ApiTags('Employee Self-Service')
  @ApiOperation({
    summary: 'View my employee profile',
    description:
      'US-E2-04: Employee views their full profile including personal info, employment details, and appraisal history',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getMyProfile(@CurrentUser() user: CurrentUserData) {
    return this.employeeProfileService.getMyProfile(user.employeeId);
  }

  @Patch('me/contact-info')
  @ApiTags('Employee Self-Service')
  @ApiOperation({
    summary: 'Update my contact information',
    description:
      'US-E2-05: Employee updates contact info (phone, email, address) - immediate update without approval',
  })
  @ApiResponse({
    status: 200,
    description: 'Contact information updated successfully',
  })
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
  @ApiTags('Employee Self-Service')
  @ApiOperation({
    summary: 'Update biography and profile picture',
    description:
      'US-E2-12: Employee adds biography and uploads profile picture',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
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
  @ApiTags('Employee Self-Service')
  @ApiOperation({
    summary: 'Submit profile change request',
    description:
      'US-E6-02, US-E2-06: Employee requests corrections for critical data (job title, department, name, marital status, etc.)',
  })
  @ApiResponse({
    status: 201,
    description: 'Change request submitted successfully',
  })
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
  @ApiTags('Employee Self-Service')
  @ApiOperation({
    summary: 'View my change request history',
    description: 'Employee views all their profile change requests',
  })
  @ApiResponse({
    status: 200,
    description: 'Change requests retrieved successfully',
  })
  async getMyChangeRequests(@CurrentUser() user: CurrentUserData) {
    return this.employeeProfileService.getMyChangeRequests(user.employeeId);
  }

  // ==================== DEPARTMENT MANAGER ENDPOINTS ====================

  @Get('team')
  @ApiTags('Department Manager')
  @Roles(SystemRole.DEPARTMENT_HEAD)
  @ApiOperation({
    summary: 'View team members profiles',
    description:
      'US-E4-01, US-E4-02: Manager views team member profiles (excluding sensitive data) with summary of job titles and departments',
  })
  @ApiResponse({
    status: 200,
    description: 'Team members retrieved successfully',
  })
  async getTeamMembers(@CurrentUser() user: CurrentUserData) {
    // Assuming user object contains managerPositionId
    const managerPositionId = user['managerPositionId'] || user.employeeId;
    return this.employeeProfileService.getTeamMembers(managerPositionId);
  }

  @Get('team/:employeeId')
  @ApiTags('Department Manager')
  @Roles(SystemRole.DEPARTMENT_HEAD)
  @ApiOperation({
    summary: 'View specific team member profile',
    description:
      'US-E4-01: Manager views detailed profile of a direct report (non-sensitive data)',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Not a direct report' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getTeamMemberProfile(
    @CurrentUser() user: CurrentUserData,
    @Param('employeeId') employeeId: string,
  ) {
    const managerPositionId = user['managerPositionId'] || user.employeeId;
    return this.employeeProfileService.getTeamMemberProfile(
      employeeId,
      managerPositionId,
    );
  }

  // ==================== HR ADMIN / SYSTEM ADMIN ENDPOINTS ====================

  @Get('search')
  @ApiTags('HR Admin')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Search employees',
    description:
      'US-E6-03: HR Admin searches for employee data by various criteria',
  })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: EmployeeStatus,
    description: 'Filter by employee status',
  })
  @ApiQuery({
    name: 'departmentId',
    required: false,
    description: 'Filter by department ID',
  })
  @ApiResponse({ status: 200, description: 'Search results' })
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

  @Get(':employeeId')
  @ApiTags('HR Admin')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Get employee profile by ID',
    description: 'HR Admin retrieves full employee profile including sensitive data',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getEmployeeById(@Param('employeeId') employeeId: string) {
    return this.employeeProfileService.getMyProfile(employeeId);
  }

  @Put(':employeeId')
  @ApiTags('HR Admin')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Update employee master data',
    description:
      'US-EP-04: HR Admin edits any part of employee profile (master data management)',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee profile updated successfully',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateEmployeeMasterData(
    @CurrentUser() user: CurrentUserData,
    @Param('employeeId') employeeId: string,
    @Body() updateDto: UpdateEmployeeMasterDto,
  ) {
    return this.employeeProfileService.updateEmployeeMasterData(
      employeeId,
      user.userId,
      user.role,
      updateDto,
    );
  }

  @Patch(':employeeId/status')
  @ApiTags('HR Admin')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Deactivate/Change employee status',
    description:
      'US-EP-05: HR Admin deactivates employee profile upon termination or resignation, or changes status',
  })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async updateEmployeeStatus(
    @CurrentUser() user: CurrentUserData,
    @Param('employeeId') employeeId: string,
    @Body()
    statusDto: { status: EmployeeStatus; effectiveDate?: Date },
  ) {
    return this.employeeProfileService.deactivateEmployee(
      employeeId,
      user.userId,
      user.role,
      statusDto.status,
      statusDto.effectiveDate,
    );
  }

  // ==================== CHANGE REQUEST MANAGEMENT ====================

  @Get('change-requests/pending')
  @ApiTags('Change Requests')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Get all pending change requests',
    description: 'HR Admin retrieves all pending profile change requests for review',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending requests retrieved successfully',
  })
  async getPendingChangeRequests() {
    return this.employeeProfileService.getPendingChangeRequests();
  }

  @Get('change-requests/:requestId')
  @ApiTags('Change Requests')
  @ApiOperation({
    summary: 'Get change request by ID',
    description: 'Retrieve details of a specific change request',
  })
  @ApiResponse({ status: 200, description: 'Request retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async getChangeRequestById(@Param('requestId') requestId: string) {
    return this.employeeProfileService.getChangeRequestById(requestId);
  }

  @Patch('change-requests/:requestId/process')
  @ApiTags('Change Requests')
  @Roles(SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.SYSTEM_ADMIN)
  @ApiOperation({
    summary: 'Process (approve/reject) change request',
    description:
      'US-E2-03: HR Admin reviews and approves or rejects employee-submitted profile changes',
  })
  @ApiResponse({
    status: 200,
    description: 'Change request processed successfully',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  async processChangeRequest(
    @CurrentUser() user: CurrentUserData,
    @Param('requestId') requestId: string,
    @Body() processDto: ProcessChangeRequestDto,
  ) {
    return this.employeeProfileService.processChangeRequest(
      requestId,
      user.userId,
      user.role,
      processDto,
    );
  }

  // ==================== FILE UPLOAD ENDPOINTS ====================

  @Post('me/profile-picture')
  @ApiTags('Employee Self-Service')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload profile picture',
    description: 'Upload and set employee profile picture',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture (max 5MB, jpeg/png/gif/webp)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async uploadProfilePicture(
    @CurrentUser() user: CurrentUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Save file
    const fileUrl = await this.employeeProfileService.saveFile(
      file,
      user.employeeId,
    );

    // Get current profile to delete old picture
    const profile = await this.employeeProfileService.getMyProfile(
      user.employeeId,
    );

    if (profile.profilePictureUrl) {
      await this.employeeProfileService.deleteFile(profile.profilePictureUrl);
    }

    // Update profile with new picture URL
    await this.employeeProfileService.updateMyProfile(
      user.employeeId,
      user.userId,
      {
        profilePictureUrl: fileUrl,
      },
    );

    return {
      message: 'Profile picture uploaded successfully',
      url: fileUrl,
    };
  }

  @Get('profile-picture/:filename')
  @ApiTags('File Upload')
  @ApiOperation({
    summary: 'Get profile picture',
    description: 'Retrieve profile picture by filename',
  })
  @ApiResponse({ status: 200, description: 'File retrieved successfully' })
  @ApiResponse({ status: 404, description: 'File not found' })
  async getProfilePicture(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const file = await this.employeeProfileService.getFile(filename);

    // Determine content type from filename
    const ext = filename.split('.').pop()?.toLowerCase();
    const contentType =
      {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
      }[ext || ''] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(file);
  }
}
