import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OffboardingService } from './offboarding.service';
import { OffboardingController } from './offboarding.controller';
import {
  OffboardingCase,
  OffboardingCaseSchema,
} from './models/offboarding-case.schema';
import {
  OffboardingChecklist,
  OffboardingChecklistSchema,
} from './models/offboarding-checklist.schema';
import {
  SystemAccessRevocation,
  SystemAccessRevocationSchema,
} from './models/access-revocation.schema';
import {
  ExitClearance,
  ExitClearanceSchema,
} from './models/exit-clearance.schema';
import {
  FinalSettlement,
  FinalSettlementSchema,
} from './models/final-settlement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OffboardingCase.name, schema: OffboardingCaseSchema },
      { name: OffboardingChecklist.name, schema: OffboardingChecklistSchema },
      { name: SystemAccessRevocation.name, schema: SystemAccessRevocationSchema },
      { name: ExitClearance.name, schema: ExitClearanceSchema },
      { name: FinalSettlement.name, schema: FinalSettlementSchema },
    ]),
  ],
  controllers: [OffboardingController],
  providers: [OffboardingService],
  exports: [OffboardingService],
})
export class OffboardingModule {}