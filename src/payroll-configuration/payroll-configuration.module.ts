import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Compensation, CompensationSchema } from './schemas/Compensation.schema';
import { Allowance, AllowanceSchema } from './schemas/allowance.schema';
import { Bonus, BonusSchema } from './schemas/Bonus.schema';
import { Insurance, InsuranceSchema } from './schemas/insurance.schema';
import { PayGrade, PayGradeSchema } from './schemas/paygrade.schema';
import { PayrollPolicy, PayrollPolicySchema } from './schemas/PayrollPolicy.schema';
import { PayType, PayTypeSchema } from './schemas/paytype.schema';
import { PayrollConfigurationService } from './payroll-configuration.service';
import { Employee, EmployeeSchema } from '../employee-profile/schemas/employee.schema';
import {OnboardingTask, OnboardingTaskSchema } from '../recruitment/models/onboarding-task.schema';
import { OffboardingCase, OffboardingCaseSchema } from 'src/recruitment/models/offboarding-case.schema';
import { JobPosition, JobPositionSchema } from '../org-structure/schemas/position.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Compensation.name, schema: CompensationSchema },
      { name: Allowance.name, schema: AllowanceSchema },
      { name: Bonus.name, schema: BonusSchema },
      { name: Insurance.name, schema: InsuranceSchema },
      { name: PayGrade.name, schema: PayGradeSchema },
      { name: PayrollPolicy.name, schema: PayrollPolicySchema },
      { name: PayType.name, schema: PayTypeSchema },
      { name: Employee.name, schema: EmployeeSchema },
      { name: OnboardingTask.name, schema: OnboardingTaskSchema },
      { name: OffboardingCase.name, schema: OffboardingCaseSchema },
      { name: JobPosition.name, schema: JobPositionSchema },
    ]),
  ],
  providers: [PayrollConfigurationService],
  exports: [PayrollConfigurationService],
})
export class PayrollConfigurationModule {}
