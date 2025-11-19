import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PayrollTrackingService } from './payroll-tracking.service';
import { PayrollTrackingController } from './payroll-tracking.controller';

import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { Claim, ClaimSchema } from './schemas/claim.schema';
import { Refund, RefundSchema } from './schemas/refund.schema';
import { PayrollReport, PayrollReportSchema } from './schemas/payroll-report.schema';

import { PayrollProcessingModule } from '../payroll-processing/payroll-processing.module';
import { PayrollConfigurationModule } from '../payroll-configuration/payroll-configuration.module';
import { EmployeeProfileModule } from '../employee-profile/employee-profile.module';
import { LeavesModule } from '../leaves/leaves.module';
import { OrgStructureModule } from '../org-structure/org-structure.module';

@Module({
  imports: [

    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: Claim.name, schema: ClaimSchema },
      { name: Refund.name, schema: RefundSchema },
      { name: PayrollReport.name, schema: PayrollReportSchema },
    ]),


    PayrollProcessingModule,
    PayrollConfigurationModule,
    EmployeeProfileModule,
    LeavesModule,
    OrgStructureModule,
  ],

  controllers: [PayrollTrackingController],
  providers: [PayrollTrackingService],
  exports: [PayrollTrackingService],
})
export class PayrollTrackingModule {}
