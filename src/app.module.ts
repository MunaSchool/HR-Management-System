import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavesModule } from './leaves/leaves.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TimeManagementModule } from './time-management/time-management.module';
import { EmployeeProfileModule } from './employee-profile/employee-profile.module';
import { OrgStructureModule } from './org-structure/org-structure.module';
import { PayrollConfigurationModule } from './payroll-configuration/payroll-configuration.module';
import { PayrollProcessingModule } from './payroll-processing/payroll-processing.module';
import { PayrollTrackingModule } from './payroll-tracking/payroll-tracking.module';
import { PerformanceModule } from './performance/performance.module';
import { RecruitmentModule } from './recruitment/recruitment.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URL!),
    LeavesModule,
    TimeManagementModule,
    EmployeeProfileModule,
    OrgStructureModule,
    PayrollConfigurationModule,
    PayrollProcessingModule,
    PayrollTrackingModule,
    PerformanceModule,
    RecruitmentModule,

  ],
})
export class AppModule {}
 
