import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attendance, AttendanceSchema } from './models/attendance.model';

@Module({
    imports: [MongooseModule.forFeature([{name: 'attendance',schema: AttendanceSchema}])]
})
export class AttendanceModule {}
