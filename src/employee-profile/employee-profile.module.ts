// src/employee-profile/employee-profile.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmployeeProfileController } from './employee-profile.controller';
import { EmployeeProfileService } from './employee-profile.service';

// Schemas (UPDATED FILENAMES)
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import {
  EmployeeDocumentFile,
  EmployeeDocumentSchema,
} from './schemas/employee-document.schema';
import {
  EmployeeChangeRequest,
  EmployeeChangeRequestSchema,
} from './schemas/employee-change-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: EmployeeDocumentFile.name, schema: EmployeeDocumentSchema },
      { name: EmployeeChangeRequest.name, schema: EmployeeChangeRequestSchema },
    ]),
  ],
  controllers: [EmployeeProfileController],
  providers: [EmployeeProfileService],
  exports: [EmployeeProfileService], // optional but recommended
})
export class EmployeeProfileModule {}
