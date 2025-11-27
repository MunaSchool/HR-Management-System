import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmployeeProfileModule } from './employee-profile/employee-profile.module';
import { OrgStructureModule } from './org-structure/org-structure.module';
import { PerformanceModule } from './performance/performance.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env variables available everywhere
    }),

MongooseModule.forRoot(process.env.DB_URL as string),

    EmployeeProfileModule,
    OrgStructureModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
