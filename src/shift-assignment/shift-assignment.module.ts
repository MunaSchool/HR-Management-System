import { Module } from '@nestjs/common';
import { ShiftAssignmentService } from './shift-assignment.service';
import { ShiftAssignmentController } from './shift-assignment.controller';
import {MongooseModule} from '@nestjs/mongoose'
import { ShiftAssignment ,ShiftAssignmentSchema } from './models/shift-assignment.model';

@Module({
  imports: [MongooseModule.forFeature([{name: ShiftAssignment.name, schema: ShiftAssignmentSchema}])],
  controllers: [ShiftAssignmentController],
  providers: [ShiftAssignmentService],
})
export class ShiftAssignmentModule {}
