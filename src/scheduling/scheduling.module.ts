import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulingSchema } from './models/scheduling.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "Scheduling", schema: SchedulingSchema}])],
  controllers: [SchedulingController],
  providers: [SchedulingService],
})
export class SchedulingModule {}
