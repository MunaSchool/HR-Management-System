import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LeaveCategory } from './models/leave-category.schema';
import { LeaveType } from './models/leave-type.schema';
import { VacationPackage } from './models/vacation-package.schema';
import { LeaveRequest, LeaveRequestStatus } from './models/leave-request.schema';
import { HolidayCalendar } from './models/holiday-calendar.schema';
import { ManualAdjustment } from './models/manual-adjustment.schema';

import { CreateLeaveCategoryDto } from './dto/create-leave-category.dto';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateVacationPackageDto } from './dto/create-vacation-package.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(LeaveCategory.name)
    private readonly categoryModel: Model<LeaveCategory>,

    @InjectModel(LeaveType.name)
    private readonly typeModel: Model<LeaveType>,

    @InjectModel(VacationPackage.name)
    private readonly packageModel: Model<VacationPackage>,

    @InjectModel(LeaveRequest.name)
    private readonly leaveModel: Model<LeaveRequest>,

    @InjectModel(HolidayCalendar.name)
    private readonly holidayModel: Model<HolidayCalendar>,

    @InjectModel(ManualAdjustment.name)
    private readonly manualAdjustModel: Model<ManualAdjustment>,
  ) {}

  // --------------------- PHASE 1: Policy Setup ---------------------

  createCategory(dto: CreateLeaveCategoryDto) {
    return this.categoryModel.create(dto);
  }

  getAllCategories() {
    return this.categoryModel.find().exec();
  }

  createLeaveType(dto: CreateLeaveTypeDto) {
    return this.typeModel.create(dto);
  }

  getAllLeaveTypes() {
    return this.typeModel.find().populate('category').exec();
  }

  createPackage(dto: CreateVacationPackageDto) {
    return this.packageModel.create(dto);
  }

  getAllPackages() {
    return this.packageModel.find().exec();
  }

  // --------------------- PHASE 2: Request & Approval ---------------------

  async createLeaveRequest(dto: CreateLeaveRequestDto) {
    const { leaveTypeId, dateFrom, dateTo } = dto;
    const type = await this.typeModel.findById(leaveTypeId);
    if (!type) throw new NotFoundException('Leave type not found');

    const days =
      (new Date(dateTo).getTime() - new Date(dateFrom).getTime()) /
        (1000 * 60 * 60 * 24) +
      1;
    if (days <= 0) throw new BadRequestException('Invalid date range');

    const overlap = await this.leaveModel.findOne({
      employeeId: dto.employeeId,
      status: {
        $in: [
          LeaveRequestStatus.PENDING_MANAGER,
          LeaveRequestStatus.PENDING_HR,
          LeaveRequestStatus.HR_APPROVED,
        ],
      },
      $or: [{ dateFrom: { $lte: dateTo }, dateTo: { $gte: dateFrom } }],
    });
    if (overlap) throw new BadRequestException('Overlapping leave exists');

    const request = new this.leaveModel({
      ...dto,
      totalDays: days,
      status: LeaveRequestStatus.PENDING_MANAGER,
    });

    return request.save();
  }

  async updateLeaveStatus(id: string, dto: UpdateLeaveStatusDto, role: string) {
    const leave = await this.leaveModel.findById(id);
    if (!leave) throw new NotFoundException('Leave request not found');

    if (role === 'MANAGER') {
      if (leave.status !== LeaveRequestStatus.PENDING_MANAGER)
        throw new BadRequestException('Manager cannot act now');
      leave.managerDecisionAt = new Date();
      leave.managerDecisionNote = dto.note;
      leave.status =
        dto.status === LeaveRequestStatus.MANAGER_APPROVED
          ? LeaveRequestStatus.PENDING_HR
          : LeaveRequestStatus.MANAGER_REJECTED;
    }

    if (role === 'HR') {
      if (leave.status !== LeaveRequestStatus.PENDING_HR)
        throw new BadRequestException('HR cannot act now');
      leave.hrDecisionAt = new Date();
      leave.hrDecisionNote = dto.note;
      leave.status = dto.status as LeaveRequestStatus;
    }

    return leave.save();
  }

  getAllLeaves() {
    return this.leaveModel.find().populate('leaveTypeId').exec();
  }

  getLeavesByEmployee(empId: string) {
    return this.leaveModel
      .find({ employeeId: empId })
      .populate('leaveTypeId')
      .exec();
  }

  // --------------------- PHASE 3: Monitoring & Auditing ---------------------

  // Holidays and Blocked Days
  createHolidayCalendar(data: any) {
    return this.holidayModel.create(data);
  }

  getAllCalendars() {
    return this.holidayModel.find().exec();
  }

  // Accrual Summary
  async getAccrualSummary() {
    const packages = await this.packageModel.find();
    return packages.map((pkg) => ({
      name: pkg.name,
      accrualRate: pkg.accrualRate,
      carryOverLimit: pkg.carryOverLimit,
      pauseDuringUnpaid: pkg.pauseDuringUnpaid,
      resetDate: pkg.resetDate,
    }));
  }

  // Convert to unpaid (BR-29)
  async markAsUnpaid(id: string) {
    const leave = await this.leaveModel.findById(id);
    if (!leave) throw new NotFoundException('Leave not found');
    leave.isConvertedToUnpaid = true;
    leave.status = LeaveRequestStatus.HR_APPROVED;
    return leave.save();
  }

  // Manual Adjustments (REQ-013, BR-17)
  async applyManualAdjustment(data: {
    employeeId: string;
    changeDays: number;
    reason: string;
    modifiedBy: string;
  }) {
    const adj = await this.manualAdjustModel.create(data);
    return {
      message: 'Manual adjustment recorded',
      adjustment: adj,
    };
  }

  // Accrual Job (REQ-040/041)
  async runAccrualJob() {
    const packages = await this.packageModel.find({ accrualEnabled: true });
    const executedAt = new Date();
    // Real logic: iterate employees linked to package & increment balance.
    return {
      message: `Accrual executed for ${packages.length} packages.`,
      timestamp: executedAt,
    };
  }

  // Encashment Utility (BR-52/53)
  calculateEncashment(dailySalaryRate: number, unusedDays: number) {
    const cappedDays = Math.min(unusedDays, 30);
    const amount = dailySalaryRate * cappedDays;
    return { cappedDays, amount };
  }
}
