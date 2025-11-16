// src/org-structure/org-structure.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrgStructureController } from './org-structure.controller';
import { OrgStructureService } from './org-structure.service';

// Schemas
import { Department, DepartmentSchema } from './schemas/department.schema';
import { JobPosition, JobPositionSchema } from './schemas/position.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Department.name, schema: DepartmentSchema },
      { name: JobPosition.name, schema: JobPositionSchema },
    ]),
  ],
  controllers: [OrgStructureController],
  providers: [OrgStructureService],
  exports: [OrgStructureService], // optional but useful if other modules need it
})
export class OrgStructureModule {}
