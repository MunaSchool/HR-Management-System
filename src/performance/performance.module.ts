// src/performance/performance.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';

// ===== Schemas =====
import {
  PerformanceTemplate,
  PerformanceTemplateSchema,
} from './schemas/performance-template.schema';

import {
  Appraisal,
  AppraisalSchema,
} from './schemas/appraisal.schema';

import {
  AppraisalCycle,
  AppraisalCycleSchema,
} from './schemas/appraisal-cycle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PerformanceTemplate.name, schema: PerformanceTemplateSchema },
      { name: Appraisal.name, schema: AppraisalSchema },
      { name: AppraisalCycle.name, schema: AppraisalCycleSchema },
    ]),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService], // so other modules can use performance data
})
export class PerformanceModule {}
