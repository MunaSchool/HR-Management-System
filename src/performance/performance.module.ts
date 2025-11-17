// src/performance/performance.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { EmployeeProfileModule } from '../employee-profile/employee-profile.module';
import { OrgStructureModule } from '../org-structure/org-structure.module';

// ===== Schemas =====
import {PerformanceTemplate,PerformanceTemplateSchema,} from './models/performance-template.schema';

import {Appraisal,AppraisalSchema,} from './models/appraisal.schema';

import { AppraisalCycle,AppraisalCycleSchema,} from './models/appraisal-cycle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PerformanceTemplate.name, schema: PerformanceTemplateSchema },
      { name: Appraisal.name, schema: AppraisalSchema },
      { name: AppraisalCycle.name, schema: AppraisalCycleSchema },
    ]),
    forwardRef(() => EmployeeProfileModule),
    forwardRef(() => OrgStructureModule),
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
