import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';

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
import { TerminationReview, TerminationReviewSchema } from './models/termination-review.schema';@Module({
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
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService, MongooseModule],
})
export class RecruitmentModule {}