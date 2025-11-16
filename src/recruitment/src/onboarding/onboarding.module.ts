import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
<<<<<<< HEAD

import {
  OnboardingDocument,
  OnboardingDocumentSchema,
} from './models/onboarding-document.schema';

import {
  OnboardingTask,
  OnboardingTaskSchema,
} from './models/onboarding-task.schema';

import {
  PayrollInitiation,
  PayrollInitiationSchema,
} from './models/payroll-initiation.schema';

import {
  PhysicalResourceProvisioning,
  PhysicalResourceProvisioningSchema,
} from './models/physical-resource-provisioning.schema';

import {
  SystemAccessProvisioning,
  SystemAccessProvisioningSchema,
} from './models/system-access-provisioning.schema';

// If you REALLY have this file & schema, keep this import.
// If not, delete both this import and its entry in forFeature.
/*
import {
  PayrollInitiationLog,
  PayrollInitiationLogSchema,
} from './models/payroll-initiation-log.schema';
*/

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnboardingDocument.name, schema: OnboardingDocumentSchema },
      { name: OnboardingTask.name, schema: OnboardingTaskSchema },
      { name: PayrollInitiation.name, schema: PayrollInitiationSchema },
      {
        name: PhysicalResourceProvisioning.name,
        schema: PhysicalResourceProvisioningSchema,
      },
      {
        name: SystemAccessProvisioning.name,
        schema: SystemAccessProvisioningSchema,
      },
      // Uncomment only if PayrollInitiationLog exists:
      // { name: PayrollInitiationLog.name, schema: PayrollInitiationLogSchema },
    ]),
  ],
=======
import { OnboardingController } from './onboarding.controller';

@Module({
>>>>>>> 6adf6fdb96ed70b61a78de90a315ad7250a92763
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
