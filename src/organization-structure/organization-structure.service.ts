import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Department, DepartmentDocument } from './models/department.schema';
import { Position, PositionDocument } from './models/position.schema';
import { StructureChangeRequest, StructureChangeRequestDocument } from './models/structure-change-request.schema';

@Injectable()
export class OrganizationStructureService {
 constructor(
  @InjectModel(Department.name)
  private readonly departmentModel: Model<DepartmentDocument>,

  @InjectModel(Position.name)
  private readonly positionModel: Model<PositionDocument>,

  @InjectModel(StructureChangeRequest.name)
  private readonly changeRequestModel: Model<StructureChangeRequestDocument>,
) {

  // ============================
  // 🔥 DISABLE BROKEN SCHEMA HOOKS
  // ============================

  // Disable pre-save hook
  this.positionModel.schema.pre('save', function (next) {
    const doc: any = this;   // <-- FIX: cast to any
    doc.reportsToPositionId = undefined;  // <-- FIX: use undefined, not null
    next();
  });

  // Disable pre-findOneAndUpdate hook
  this.positionModel.schema.pre('findOneAndUpdate', function (next) {
    const query: any = this;   // <-- FIX: cast to any

    const update = query.getUpdate() || {};
    if (!update.$set) update.$set = {};

    update.$set.reportsToPositionId = undefined;

    query.setUpdate(update);
    next();
  });
}

  // ======================
  // 📌 CREATE DEPARTMENT
  // ======================
  async createDepartment(dto: any) {
    return this.departmentModel.create(dto);
  }

  // ===========================
  // 📌 GET DEPARTMENT BY ID
  // ===========================
  async getDepartmentById(id: string) {
    const dept = await this.departmentModel.findById(id).exec();
    if (!dept) throw new NotFoundException("Department not found");
    return dept;
  }

  // ============================
  // 📌 GET ALL DEPARTMENTS
  // ============================
  async getAllDepartments(showInactive: boolean = false) {
    if (showInactive) {
      return this.departmentModel.find().exec();
    }
    return this.departmentModel.find({ isActive: true }).exec();
  }

  // ============================
  // 📌 UPDATE DEPARTMENT
  // ============================
  async updateDepartment(id: string, dto: any) {
    const updated = await this.departmentModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException("Department not found");
    return updated;
  }

  // ============================
  // 📌 DEACTIVATE DEPARTMENT
  // ============================
  async deactivateDepartment(id: string) {
    const updated = await this.departmentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!updated) throw new NotFoundException("Department not found");
    return updated;
  }

  // ======================
  // 📌 CREATE POSITION
  // ======================
  async createPosition(dto: any) {
    const department = await this.departmentModel.findById(dto.departmentId);
    if (!department) throw new NotFoundException('Department not found');

    const pos = await this.positionModel.create({
      ...dto,
      reportsToPositionId: null
    });

    return pos;
  }

  // ======================
  // 📌 GET ALL POSITIONS
  // ======================
  async getAllPositions() {
    return this.positionModel.find().exec();
  }

  // ======================
  // 📌 GET POSITION BY ID
  // ======================
  async getPositionById(id: string) {
    const pos = await this.positionModel.findById(id).exec();
    if (!pos) throw new NotFoundException("Position not found");
    return pos;
  }

  // ======================
  // 📌 UPDATE POSITION
  // ======================
  async updatePosition(id: string, dto: any) {
    const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException("Position not found");
    return updated;
  }

  // ======================
  // 📌 UPDATE REPORTING LINE
  // ======================
  async updateReportingLine(id: string, dto: any) {
    const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException("Position not found");
    return updated;
  }

  // ======================
  // 📌 MOVE POSITION
  // ======================
  async movePosition(id: string, dto: any) {
    const updated = await this.positionModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException("Position not found");
    return updated;
  }

  // ======================
  // 📌 DEACTIVATE POSITION
  // ======================
  async deactivatePosition(id: string) {
    const updated = await this.positionModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!updated) throw new NotFoundException("Position not found");
    return updated;
  }

  // ======================
  // 📌 SUBMIT CHANGE REQUEST
  // ======================
  async submitChangeRequest(dto: any) {
    return this.changeRequestModel.create(dto);
  }

  // ======================
  // 📌 GET ALL CHANGE REQUESTS
  // ======================
  async getAllChangeRequests() {
    return this.changeRequestModel.find().exec();
  }

  // ======================
  // 📌 GET CHANGE REQUEST BY ID
  // ======================
  async getChangeRequestById(id: string) {
    const req = await this.changeRequestModel.findById(id).exec();
    if (!req) throw new NotFoundException("Change request not found");
    return req;
  }
}
