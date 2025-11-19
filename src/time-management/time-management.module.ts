import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TimeManagementService } from './time-management.service';
import { TimeManagementController } from './time-management.controller';
import { Attendance, AttendanceSchema } from './models/attendance.model';
import { CorrectionRequest, CorrectionRequestSchema } from './models/correction-request.model';
import { Escalation, EscalationSchema } from './models/escalation.model';
import { FalsePenalty, FalsePenaltySchema } from './models/falsePenalty.model';
import { Notification, NotificationSchema } from './models/notification.model';
import { Overtime, OvertimeSchema } from './models/overtime.model';
import { Scheduling, SchedulingSchema } from './models/scheduling.model';
import { ShiftAssignment, ShiftAssignmentSchema } from './models/shift-assignment.model';
import { Shift, ShiftSchema } from './models/shift.model';

// imports i added for integration
import { Employee, EmployeeSchema } from '../employee-profile/schemas/employee.schema';
import { EmployeeProfileModule } from 'src/employee-profile/employee-profile.module';
import { OrgStructureModule } from 'src/org-structure/org-structure.module';
import { LeavesModule } from 'src/leaves/leaves.module';
import { PayrollTrackingModule } from 'src/payroll-tracking/payroll-tracking.module';

@Module({
  imports: [ MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: CorrectionRequest.name, schema: CorrectionRequestSchema },
      { name: Escalation.name, schema: EscalationSchema },
      { name: FalsePenalty.name, schema: FalsePenaltySchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: Overtime.name, schema: OvertimeSchema },
      { name: Scheduling.name, schema: SchedulingSchema },
      { name: ShiftAssignment.name, schema: ShiftAssignmentSchema },
      { name: Shift.name, schema: ShiftSchema },
    
    ]),
    EmployeeProfileModule, 
    OrgStructureModule,
    LeavesModule,
    PayrollTrackingModule
  ],
  controllers: [TimeManagementController],
  providers: [TimeManagementService],
})
export class TimeManagementModule {}
