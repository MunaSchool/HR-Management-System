import { Module } from '@nestjs/common';
import { FalsePenaltyService } from './false-penalty.service';
import { FalsePenaltyController } from './false-penalty.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FalsePenaltySchema } from './models/falsePenalty.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'FalsePenalty', schema: FalsePenaltySchema}])],
  controllers: [FalsePenaltyController],
  providers: [FalsePenaltyService],
})
export class FalsePenaltyModule {}
