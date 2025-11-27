/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// IMPORT SCHEMAS
import { Department, DepartmentDocument } from './models/department.schema';

import { Position, PositionDocument } from './models/position.schema';

import {
  PositionAssignment,
  PositionAssignmentDocument,
} from './models/position-assignment.schema';

import {
  StructureChangeRequest,
  StructureChangeRequestDocument,
} from './models/structure-change-request.schema';

import {
  StructureApproval,
  StructureApprovalDocument,
} from './models/structure-approval.schema';

import {
  StructureChangeLog,
  StructureChangeLogDocument,
} from './models/structure-change-log.schema';

// IMPORT ENUMS
import {
  StructureRequestStatus,
  StructureRequestType,
  ApprovalDecision,
  ChangeLogAction,
} from './enums/organization-structure.enums';

@Injectable()
export class OrganizationStructureService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,

    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,

    @InjectModel(PositionAssignment.name)
    private readonly positionAssignmentModel: Model<PositionAssignmentDocument>,

    @InjectModel(StructureChangeRequest.name)
    private readonly changeRequestModel: Model<StructureChangeRequestDocument>,

    @InjectModel(StructureApproval.name)
    private readonly approvalModel: Model<StructureApprovalDocument>,

    @InjectModel(StructureChangeLog.name)
    private readonly changeLogModel: Model<StructureChangeLogDocument>,
  ) {}

  // DEPARTMENTS

  async createDepartment(dto: any) {
    return this.departmentModel.create(dto);
  }

  async getAllDepartments() {
    return this.departmentModel.find().lean();
  }

  async getDepartmentById(id: string) {
    return this.departmentModel.findById(id).lean();
  }

  async updateDepartment(id: string, dto: any) {
    return this.departmentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
  }

  async deactivateDepartment(id: string) {
    return this.departmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }

  //  POSITIONS

  async createPosition(dto: any) {
    return this.positionModel.create(dto);
  }

  async getAllPositions() {
    return this.positionModel.find().lean();
  }

  async getPositionById(id: string) {
    return this.positionModel.findById(id).lean();
  }

  async updatePosition(id: string, dto: any) {
    return this.positionModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async updateReportingLine(id: string, dto: any) {
    return this.positionModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async movePosition(id: string, dto: any) {
    return this.positionModel.findByIdAndUpdate(id, dto, { new: true }).lean();
  }

  async deactivatePosition(id: string) {
    return this.positionModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
  }

  // STRUCTURE CHANGE REQUESTS

  async submitChangeRequest(dto: any) {
    return this.changeRequestModel.create({
      ...dto,
      status: StructureRequestStatus.SUBMITTED,
      submittedAt: new Date(),
    });
  }

  async getAllChangeRequests() {
    return this.changeRequestModel.find().lean();
  }

  async getChangeRequestById(id: string) {
    return this.changeRequestModel.findById(id).lean();
  }
}
