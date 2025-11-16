import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from './models/attendance.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Attendance', schema: AttendanceSchema}])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
