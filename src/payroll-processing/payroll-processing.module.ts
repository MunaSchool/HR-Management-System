import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PayrollCycle, PayrollCycleSchema } from './schemas/payroll-cycle.schema';
import { PayrollDraft, PayrollDraftSchema } from './schemas/payroll-draft.schema';
import { Anomaly, AnomalySchema } from './schemas/anomaly.schema';
import { ApprovalHistory, ApprovalHistorySchema } from './schemas/approval-history.schema';

import { PayrollFinal, PayrollFinalSchema } from './schemas/payroll-final.schema';
import { Payslip, PayslipSchema } from './schemas/payslip.schema';
import { PayrollProcessingService } from './payroll-processing.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayrollCycle.name, schema: PayrollCycleSchema },
      { name: PayrollDraft.name, schema: PayrollDraftSchema },
      { name: Anomaly.name, schema: AnomalySchema },
      { name: ApprovalHistory.name, schema: ApprovalHistorySchema },

    
      { name: PayrollFinal.name, schema: PayrollFinalSchema },
      { name: Payslip.name, schema: PayslipSchema },
    ]),
  ],
    providers: [PayrollProcessingService],
    exports: [PayrollProcessingService],
})
export class PayrollProcessingModule {}
