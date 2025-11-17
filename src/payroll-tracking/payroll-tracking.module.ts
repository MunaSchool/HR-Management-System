import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payslip, PayslipSchema } from './schemas/payslip.schema';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { Claim, ClaimSchema } from './schemas/claim.schema';
import { Refund, RefundSchema } from './schemas/refund.schema';
import { PayrollReport, PayrollReportSchema } from './schemas/payroll-report.schema';
import { PayrollTestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payslip.name, schema: PayslipSchema },
      { name: Dispute.name, schema: DisputeSchema },
      { name: Claim.name, schema: ClaimSchema },
      { name: Refund.name, schema: RefundSchema },
      { name: PayrollReport.name, schema: PayrollReportSchema },
    ]),
  ],
  providers: [PayrollTestService],
})
export class PayrollTrackingModule {}
