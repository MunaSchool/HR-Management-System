// src/org-structure/org-structure.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrgStructureController } from './org-structure.controller';
import { OrgStructureService } from './org-structure.service';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { JobPosition, JobPositionSchema } from './schemas/position.schema';
import { EmployeeProfileModule } from './../employee-profile/employee-profile.module';

import { PayrollConfigurationModule } from 'src/payroll-configuration/payroll-configuration.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: JobPosition.name, schema: JobPositionSchema },
    ]),
    forwardRef(()=>EmployeeProfileModule), 
    PayrollConfigurationModule
   
  ],
  controllers: [OrgStructureController],
  providers: [OrgStructureService],
  exports: [OrgStructureService],
})
export class OrgStructureModule {}
