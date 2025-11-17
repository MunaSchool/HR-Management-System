import { ShiftAssignment, ShiftAssignmentDocument, ShiftAssignmentSchema } from './models/shift-assignment.model';
import { Injectable } from '@nestjs/common';
import { CreateShiftAssignmentDto } from './dto/create-shift-assignment.dto';
import { UpdateShiftAssignmentDto } from './dto/update-shift-assignment.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose,{ Model } from 'mongoose';

@Injectable()
export class ShiftAssignmentService {
  constructor(
    @InjectModel(ShiftAssignment.name)
    private readonly shiftAssignmentModel : Model<ShiftAssignmentDocument>
  ) {}
  async create(createShiftAssignmentDto: CreateShiftAssignmentDto) {
    return this.shiftAssignmentModel.create(createShiftAssignmentDto)
    
  }

  async findAll() {
    return this.shiftAssignmentModel.find()
  }

  async findOne(id: string) {
    return this.shiftAssignmentModel.findById(id).exec()
  }

  async update(id: string, updateShiftAssignmentDto: UpdateShiftAssignmentDto) {
    return this.shiftAssignmentModel.findByIdAndUpdate(
      id,
      updateShiftAssignmentDto
    )
  }

  async remove(id: string) {
    return this.shiftAssignmentModel.findByIdAndDelete(id)
  }
}
