import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';
import {
  Application,
  ApplicationSchema,
} from './models/application.schema';
import {
  Candidate,
  CandidateSchema,
} from './models/candidate.schema';
import {
  Interview,
  InterviewSchema,
} from './models/interview.schema';
import {
  JobOffer,
  JobOfferSchema,
} from './models/job-offer.schema';
import {
  JobPosting,
  JobPostingSchema,
} from './models/job-posting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: Interview.name, schema: InterviewSchema },
      { name: JobOffer.name, schema: JobOfferSchema },
      { name: JobPosting.name, schema: JobPostingSchema },
    ]),
  ],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
  exports: [RecruitmentService, MongooseModule],
})
export class RecruitmentModule {}