// src/employee-profile/employee-profile.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmployeeController } from './employee-profile.controller';
import { EmployeeService } from './employee-profile.service';

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
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports: [EmployeeService], // optional but recommended
})
export class EmployeeModule {}
