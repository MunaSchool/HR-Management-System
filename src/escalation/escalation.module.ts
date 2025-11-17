import { Module } from '@nestjs/common';
import { EscalationService } from './escalation.service';
import { EscalationController } from './escalation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EscalationSchema } from './models/escalation.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "Escalation", schema: EscalationSchema}])],
  controllers: [EscalationController],
  providers: [EscalationService],
})
export class EscalationModule {}
