import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scheduling, SchedulingSchema } from './models/scheduling.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "scheduling", schema: SchedulingSchema }])
  ],
})
export class SchedulingModule {}
