import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PayrollCycle, PayrollCycleSchema } from './schemas/payroll-cycle.schema';
import { PayrollDraft, PayrollDraftSchema } from './schemas/payroll-draft.schema';
import { Anomaly, AnomalySchema } from './schemas/anomaly.schema';
import { ApprovalHistory, ApprovalHistorySchema } from './schemas/approval-history.schema';

import { PayrollFinal, PayrollFinalSchema } from './schemas/payroll-final.schema';
import { Payslip, PayslipSchema } from './schemas/payslip.schema';
import { PayrollProcessingService } from './payroll-processing.service';

import { Employee, EmployeeSchema } from '../employee-profile/schemas/employee.schema';
import { Bonus, BonusSchema } from '../payroll-configuration/schemas/Bonus.schema';
import { Compensation, CompensationSchema } from '../payroll-configuration/schemas/Compensation.schema';
import { TaxRule , TaxRuleSchema} from '../payroll-configuration/schemas/TaxRule.schema';
import { Insurance , InsuranceSchema} from '../payroll-configuration/schemas/insurance.schema';
import { PayGrade , PayGradeSchema} from '../payroll-configuration/schemas/paygrade.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PayrollCycle.name, schema: PayrollCycleSchema },
      { name: PayrollDraft.name, schema: PayrollDraftSchema },
      { name: Anomaly.name, schema: AnomalySchema },
      { name: ApprovalHistory.name, schema: ApprovalHistorySchema },

    
      { name: PayrollFinal.name, schema: PayrollFinalSchema },
      { name: Payslip.name, schema: PayslipSchema },

      { name: Employee.name, schema: EmployeeSchema },
      { name: Bonus.name, schema: BonusSchema },
      { name: Compensation.name, schema: CompensationSchema },
      { name: TaxRule.name, schema: TaxRuleSchema },
      { name: Insurance.name, schema: InsuranceSchema },
      { name: PayGrade.name, schema: PayGradeSchema },
    ]),
  ],
    providers: [PayrollProcessingService],
    exports: [PayrollProcessingService],
})
export class PayrollProcessingModule {}
