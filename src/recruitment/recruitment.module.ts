import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';

import { Employee, EmployeeSchema } from '../employee-profile/schemas/employee.schema';
import { Notification, NotificationSchema } from '../time-management/models/notification.model';
import { JobPosition, JobPositionSchema } from '../org-structure/schemas/position.schema';
import { Scheduling, SchedulingSchema } from '../time-management/models/scheduling.model';
import { Allowance, AllowanceSchema } from '../payroll-configuration/schemas/allowance.schema';

import { Application, ApplicationSchema } from './models/application.schema';
import { Candidate, CandidateSchema } from './models/candidate.schema';
import { Interview, InterviewSchema } from './models/interview.schema';
import { JobOffer, JobOfferSchema } from './models/job-offer.schema';
import { JobPosting, JobPostingSchema } from './models/job-posting.schema';
import { OffboardingCase, OffboardingCaseSchema } from './models/offboarding-case.schema';
import { OffboardingChecklist, OffboardingChecklistSchema } from './models/offboarding-checklist.schema';
import { OnboardingDocument, OnboardingDocumentSchema } from './models/onboarding-document.schema';
import { OnboardingTask, OnboardingTaskSchema } from './models/onboarding-task.schema';
import { PhysicalResourceProvisioning, PhysicalResourceProvisioningSchema } from './models/physical-resource-provisioning.schema';
import { SystemAccessProvisioning, SystemAccessProvisioningSchema } from './models/system-access-provisioning.schema';
import { TerminationReview, TerminationReviewSchema } from './models/termination-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: Interview.name, schema: InterviewSchema },
      { name: JobOffer.name, schema: JobOfferSchema },
      { name: JobPosting.name, schema: JobPostingSchema },
      { name: OffboardingCase.name, schema: OffboardingCaseSchema },
      { name: OffboardingChecklist.name, schema: OffboardingChecklistSchema },
      { name: OnboardingDocument.name, schema: OnboardingDocumentSchema },
      { name: OnboardingTask.name, schema: OnboardingTaskSchema },
      { name: PhysicalResourceProvisioning.name, schema: PhysicalResourceProvisioningSchema },
      { name: SystemAccessProvisioning.name, schema: SystemAccessProvisioningSchema },
      { name: TerminationReview.name, schema: TerminationReviewSchema },

      // External dependencies
      { name: Employee.name, schema: EmployeeSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: JobPosition.name, schema: JobPositionSchema },
      { name: Scheduling.name, schema: SchedulingSchema },
      { name: Allowance.name, schema: AllowanceSchema },
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService, MongooseModule],
})
export class RecruitmentModule {}
