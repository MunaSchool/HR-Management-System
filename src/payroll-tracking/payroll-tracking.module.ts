import { PayrollTrackingService } from './payroll-tracking.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { Claim, ClaimSchema } from './schemas/claim.schema';
import { Refund, RefundSchema } from './schemas/refund.schema';
import { PayrollReport, PayrollReportSchema } from './schemas/payroll-report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: Claim.name, schema: ClaimSchema },
      { name: Refund.name, schema: RefundSchema },
      { name: PayrollReport.name, schema: PayrollReportSchema },
    ]),
  ],
  providers: [PayrollTrackingService],
})
export class PayrollTrackingModule {}
