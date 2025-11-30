import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AppraisalRecord } from './models/appraisal-record.schema';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(AppraisalRecord.name)
    private appraisalRecordModel: Model<AppraisalRecord>,
  ) {}

  /**
   * Get appraisal history for an employee
   */
  async getEmployeeAppraisalHistory(employeeId: string | Types.ObjectId) {
    return this.appraisalRecordModel
      .find({ employeeId })
      .populate('cycleId')
      .populate('templateId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
