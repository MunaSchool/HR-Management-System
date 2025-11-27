// src/employee/employee.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

// Only the REAL dependencies
import { OrgStructureModule } from '../org-structure/org-structure.module';
import { RecruitmentModule } from '../recruitment/recruitment.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),

    forwardRef(() => OrgStructureModule), // Employee needs department & position
    forwardRef(() => RecruitmentModule),  // Employee created from hired candidate
  ],

  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
