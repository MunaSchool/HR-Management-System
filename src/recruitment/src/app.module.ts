import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { OnboardingModule } from './onboarding/onboarding.module';
import { OffboardingModule } from './offboarding/offboarding.module';
import { RecruitmentModule } from './recruitment/recruitment.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/hr_recruitment_system'),
    OnboardingModule,
    OffboardingModule,
    RecruitmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}