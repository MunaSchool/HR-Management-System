import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';

// Schemas
import { LeaveCategory, LeaveCategorySchema } from './models/leave-category.schema';
import { LeaveType, LeaveTypeSchema } from './models/leave-type.schema';
import { VacationPackage, VacationPackageSchema } from './models/vacation-package.schema';
import { LeaveRequest, LeaveRequestSchema } from './models/leave-request.schema';
import { HolidayCalendar, HolidayCalendarSchema } from './models/holiday-calendar.schema';
import { ManualAdjustment, ManualAdjustmentSchema } from './models/manual-adjustment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveCategory.name, schema: LeaveCategorySchema },
      { name: LeaveType.name, schema: LeaveTypeSchema },
      { name: VacationPackage.name, schema: VacationPackageSchema },
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
      { name: HolidayCalendar.name, schema: HolidayCalendarSchema },
      { name: ManualAdjustment.name, schema: ManualAdjustmentSchema },
    ]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}
