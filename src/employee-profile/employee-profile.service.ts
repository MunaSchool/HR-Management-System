import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import {
  EmployeeProfile,
  EmployeeProfileDocument,
} from './models/employee-profile.schema';
import {
  EmployeeProfileChangeRequest,
} from './models/ep-change-request.schema';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ProcessChangeRequestDto } from './dto/process-change-request.dto';
import { UpdateEmployeeMasterDto } from './dto/update-employee-master.dto';
import {
  ProfileChangeStatus,
  SystemRole,
  EmployeeStatus,
} from './enums/employee-profile.enums';

@Injectable()
export class EmployeeProfileService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads', 'profiles');
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  constructor(
    @InjectModel(EmployeeProfile.name)
    private employeeProfileModel: Model<EmployeeProfileDocument>,
    @InjectModel(EmployeeProfileChangeRequest.name)
    private changeRequestModel: Model<EmployeeProfileChangeRequest>,
  ) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  /**
   * Log audit action - BR 22: Trace all editing, changes, and cancellations
   * For now using console.log, can be replaced with proper audit service later
   */
  private logAudit(
    action: string,
    entityType: string,
    entityId: string,
    userId: string,
    userName: string,
    role: string,
    oldValue?: any,
    newValue?: any,
    remarks?: string,
  ): void {
    console.log('AUDIT:', {
      action,
      entityType,
      entityId,
      userId,
      userName,
      role,
      oldValue,
      newValue,
      remarks,
      timestamp: new Date().toISOString(),
    });
  }

  // ==================== EMPLOYEE SELF-SERVICE ====================

  /**
   * US-E2-04: View full employee profile
   */
  async getMyProfile(employeeId: string): Promise<EmployeeProfile> {
    const profile = await this.employeeProfileModel
      .findById(employeeId)
      .populate('primaryPositionId')
      .populate('primaryDepartmentId')
      .populate('supervisorPositionId')
      .populate('payGradeId')
      .exec();

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    return profile;
  }

  /**
   * US-E2-05: Update contact information (immediate update)
   * US-E2-12: Update biography and profile picture
   */
  async updateMyContactInfo(
    employeeId: string,
    userId: string,
    updateDto: UpdateContactInfoDto,
  ): Promise<EmployeeProfile> {
    const profile = await this.employeeProfileModel.findById(employeeId);

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    const oldValue = {
      mobilePhone: profile.mobilePhone,
      homePhone: profile.homePhone,
      personalEmail: profile.personalEmail,
      address: profile.address,
    };

    // Update contact information
    if (updateDto.mobilePhone !== undefined) {
      profile.mobilePhone = updateDto.mobilePhone;
    }
    if (updateDto.homePhone !== undefined) {
      profile.homePhone = updateDto.homePhone;
    }
    if (updateDto.personalEmail !== undefined) {
      profile.personalEmail = updateDto.personalEmail;
    }
    if (updateDto.address !== undefined) {
      profile.address = updateDto.address;
    }

    const updatedProfile = await profile.save();

    // Log audit trail (BR 22)
    this.logAudit(
      'UPDATE',
      'EmployeeProfile',
      employeeId,
      userId,
      profile.fullName || 'Employee',
      'Employee',
      oldValue,
      updateDto,
      'Self-service contact information update',
    );

    return updatedProfile;
  }

  /**
   * US-E2-12: Update biography and profile picture
   */
  async updateMyProfile(
    employeeId: string,
    userId: string,
    updateDto: UpdateProfileDto,
  ): Promise<EmployeeProfile> {
    const profile = await this.employeeProfileModel.findById(employeeId);

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    const oldValue = {
      biography: profile.biography,
      profilePictureUrl: profile.profilePictureUrl,
    };

    if (updateDto.biography !== undefined) {
      profile.biography = updateDto.biography;
    }
    if (updateDto.profilePictureUrl !== undefined) {
      profile.profilePictureUrl = updateDto.profilePictureUrl;
    }

    const updatedProfile = await profile.save();

    this.logAudit(
      'UPDATE',
      'EmployeeProfile',
      employeeId,
      userId,
      profile.fullName || 'Employee',
      'Employee',
      oldValue,
      updateDto,
      'Profile biography/picture update',
    );

    return updatedProfile;
  }

  /**
   * US-E6-02: Request corrections of critical data
   * US-E2-06: Submit request to change legal name or marital status
   */
  async createChangeRequest(
    employeeId: string,
    userId: string,
    createDto: CreateChangeRequestDto,
  ): Promise<EmployeeProfileChangeRequest> {
    const profile = await this.employeeProfileModel.findById(employeeId);

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    // Generate unique request ID
    const requestId = `CR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const changeRequest = new this.changeRequestModel({
      requestId,
      employeeProfileId: new Types.ObjectId(employeeId),
      requestDescription: createDto.requestDescription,
      reason: createDto.reason,
      status: ProfileChangeStatus.PENDING,
      submittedAt: new Date(),
    });

    const savedRequest = await changeRequest.save();

    // Log audit trail
    this.logAudit(
      'CREATE',
      'EmployeeProfileChangeRequest',
      savedRequest._id.toString(),
      userId,
      profile.fullName || 'Employee',
      'Employee',
      undefined,
      createDto,
      'Employee submitted profile change request',
    );

    return savedRequest;
  }

  // ==================== DEPARTMENT MANAGER ====================

  /**
   * US-E4-01: View team members' profiles (excluding sensitive info)
   * US-E4-02: See summary of team's job titles and departments
   */
  async getTeamMembers(
    managerPositionId: string,
  ): Promise<EmployeeProfile[]> {
    // BR 41b: Direct Managers see their team only
    // BR 18b: Privacy restrictions applied for Department Managers on sensitive data

    const teamMembers = await this.employeeProfileModel
      .find({
        supervisorPositionId: new Types.ObjectId(managerPositionId),
        status: { $ne: EmployeeStatus.TERMINATED },
      })
      .select(
        'employeeNumber firstName lastName fullName dateOfHire status primaryPositionId primaryDepartmentId profilePictureUrl',
      )
      .populate('primaryPositionId')
      .populate('primaryDepartmentId')
      .exec();

    return teamMembers;
  }

  /**
   * US-E4-01: View specific team member profile (non-sensitive data)
   */
  async getTeamMemberProfile(
    employeeId: string,
    managerPositionId: string,
  ): Promise<EmployeeProfile> {
    const profile = await this.employeeProfileModel
      .findById(employeeId)
      .populate('primaryPositionId')
      .populate('primaryDepartmentId')
      .exec();

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    // Verify that this employee reports to the manager
    if (
      profile.supervisorPositionId?.toString() !== managerPositionId.toString()
    ) {
      throw new ForbiddenException(
        'You can only view profiles of your direct reports',
      );
    }

    // Return profile without sensitive data (salary, national ID, etc.)
    return profile;
  }

  // ==================== HR ADMIN / SYSTEM ADMIN ====================

  /**
   * US-E6-03: Search for employees
   */
  async searchEmployees(
    searchQuery: string,
    status?: EmployeeStatus,
    departmentId?: string,
  ): Promise<EmployeeProfile[]> {
    const filter: any = {};

    if (searchQuery) {
      filter.$or = [
        { employeeNumber: { $regex: searchQuery, $options: 'i' } },
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { workEmail: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (departmentId) {
      filter.primaryDepartmentId = new Types.ObjectId(departmentId);
    }

    return this.employeeProfileModel
      .find(filter)
      .populate('primaryPositionId')
      .populate('primaryDepartmentId')
      .populate('supervisorPositionId')
      .limit(100)
      .exec();
  }

  /**
   * US-EP-04: Edit any part of employee's profile (master data management)
   */
  async updateEmployeeMasterData(
    employeeId: string,
    adminUserId: string,
    adminRole: string,
    updateDto: UpdateEmployeeMasterDto,
  ): Promise<EmployeeProfile> {
    // BR 20a: Only authorized roles can create and/or modify profile data
    const authorizedRoles = [
      SystemRole.HR_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.SYSTEM_ADMIN,
    ];

    if (!authorizedRoles.includes(adminRole as SystemRole)) {
      throw new ForbiddenException(
        'You do not have permission to modify employee master data',
      );
    }

    const profile = await this.employeeProfileModel.findById(employeeId);

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    const oldValue = { ...profile.toObject() };

    // Update all allowed fields
    Object.keys(updateDto).forEach((key) => {
      if (updateDto[key] !== undefined) {
        profile[key] = updateDto[key];
      }
    });

    // Update full name if first or last name changed
    if (updateDto.firstName || updateDto.lastName) {
      profile.fullName = `${profile.firstName} ${profile.middleName ? profile.middleName + ' ' : ''}${profile.lastName}`;
    }

    const updatedProfile = await profile.save();

    // Log audit trail (BR 22)
    this.logAudit(
      'UPDATE',
      'EmployeeProfile',
      employeeId,
      adminUserId,
      `Admin: ${adminRole}`,
      adminRole,
      oldValue,
      updateDto,
      'HR Admin master data update',
    );

    return updatedProfile;
  }

  /**
   * US-E2-03: Review and approve employee-submitted profile changes
   */
  async processChangeRequest(
    requestId: string,
    adminUserId: string,
    adminRole: string,
    processDto: ProcessChangeRequestDto,
  ): Promise<EmployeeProfileChangeRequest> {
    // BR 36: All changes must be made via workflow approval
    const authorizedRoles = [
      SystemRole.HR_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.SYSTEM_ADMIN,
    ];

    if (!authorizedRoles.includes(adminRole as SystemRole)) {
      throw new ForbiddenException(
        'You do not have permission to process change requests',
      );
    }

    const changeRequest = await this.changeRequestModel.findOne({ requestId });

    if (!changeRequest) {
      throw new NotFoundException('Change request not found');
    }

    if (changeRequest.status !== ProfileChangeStatus.PENDING) {
      throw new BadRequestException(
        'This change request has already been processed',
      );
    }

    const oldStatus = changeRequest.status;
    changeRequest.status = processDto.status;
    changeRequest.processedAt = new Date();

    const updatedRequest = await changeRequest.save();

    // Log audit trail
    this.logAudit(
      processDto.status === ProfileChangeStatus.APPROVED
        ? 'APPROVE'
        : 'REJECT',
      'EmployeeProfileChangeRequest',
      updatedRequest._id.toString(),
      adminUserId,
      `Admin: ${adminRole}`,
      adminRole,
      { status: oldStatus },
      { status: processDto.status, remarks: processDto.remarks },
      processDto.remarks || 'Change request processed',
    );

    return updatedRequest;
  }

  /**
   * US-EP-05: Deactivate employee's profile upon termination or resignation
   */
  async deactivateEmployee(
    employeeId: string,
    adminUserId: string,
    adminRole: string,
    newStatus: EmployeeStatus,
    effectiveDate?: Date,
  ): Promise<EmployeeProfile> {
    // BR 20a: Only authorized roles
    const authorizedRoles = [
      SystemRole.HR_ADMIN,
      SystemRole.HR_MANAGER,
      SystemRole.SYSTEM_ADMIN,
    ];

    if (!authorizedRoles.includes(adminRole as SystemRole)) {
      throw new ForbiddenException(
        'You do not have permission to deactivate employees',
      );
    }

    const profile = await this.employeeProfileModel.findById(employeeId);

    if (!profile) {
      throw new NotFoundException('Employee profile not found');
    }

    const oldStatus = profile.status;
    profile.status = newStatus;
    profile.statusEffectiveFrom = effectiveDate || new Date();

    const updatedProfile = await profile.save();

    // Log audit trail
    this.logAudit(
      'UPDATE',
      'EmployeeProfile',
      employeeId,
      adminUserId,
      `Admin: ${adminRole}`,
      adminRole,
      { status: oldStatus },
      { status: newStatus, statusEffectiveFrom: profile.statusEffectiveFrom },
      `Employee status changed to ${newStatus}`,
    );

    // BR 20, BR 17: Trigger synchronization with other modules
    // This would notify Payroll and Time Management modules
    console.log(
      `🔔 Status change triggered for employee ${profile.employeeNumber}. Notify Payroll and Time Management modules.`,
    );

    return updatedProfile;
  }

  /**
   * Get all pending change requests for HR review
   */
  async getPendingChangeRequests(): Promise<EmployeeProfileChangeRequest[]> {
    return this.changeRequestModel
      .find({ status: ProfileChangeStatus.PENDING })
      .populate('employeeProfileId')
      .sort({ submittedAt: -1 })
      .exec();
  }

  /**
   * Get change request by ID
   */
  async getChangeRequestById(
    requestId: string,
  ): Promise<EmployeeProfileChangeRequest> {
    const request = await this.changeRequestModel
      .findOne({ requestId })
      .populate('employeeProfileId')
      .exec();

    if (!request) {
      throw new NotFoundException('Change request not found');
    }

    return request;
  }

  /**
   * Get employee's change request history
   */
  async getMyChangeRequests(
    employeeId: string,
  ): Promise<EmployeeProfileChangeRequest[]> {
    return this.changeRequestModel
      .find({ employeeProfileId: new Types.ObjectId(employeeId) })
      .sort({ submittedAt: -1 })
      .exec();
  }

  // ==================== FILE UPLOAD METHODS ====================

  /**
   * Validate file for upload
   */
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`,
      );
    }

    // Check mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Generate unique filename
   */
  generateFilename(originalName: string, employeeId: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = extname(originalName);
    return `profile_${employeeId}_${timestamp}_${randomStr}${ext}`;
  }

  /**
   * Save uploaded file
   */
  async saveFile(
    file: Express.Multer.File,
    employeeId: string,
  ): Promise<string> {
    this.validateFile(file);

    const filename = this.generateFilename(file.originalname, employeeId);
    const filePath = path.join(this.uploadPath, filename);

    // Write file to disk
    await fs.promises.writeFile(filePath, file.buffer);

    // Return URL path
    return `/uploads/profiles/${filename}`;
  }

  /**
   * Delete old profile picture
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      if (!fileUrl || !fileUrl.startsWith('/uploads/profiles/')) {
        return;
      }

      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadPath, filename);

      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error, just log it
    }
  }

  /**
   * Get file buffer (for serving files)
   */
  async getFile(filename: string): Promise<Buffer> {
    const filePath = path.join(this.uploadPath, filename);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    return fs.promises.readFile(filePath);
  }
}
