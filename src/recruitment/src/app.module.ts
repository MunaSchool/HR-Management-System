import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import OnboardingModule from './onboarding/onboarding.module';

@Module({
  imports: [
    // connect directly to your local Mongo for now
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/hr_recruitment_system'),

    // your onboarding subsystem
    OnboardingModule,

    OffboardingModule,

    RecruitmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
