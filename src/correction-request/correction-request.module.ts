import { Module } from '@nestjs/common';
import { CorrectionRequestService } from './correction-request.service';
import { CorrectionRequestController } from './correction-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CorrectionRequestSchema } from './models/correction-request.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "CorrectionRequest", schema: CorrectionRequestSchema}])],
  controllers: [CorrectionRequestController],
  providers: [CorrectionRequestService],
})
export class CorrectionRequestModule {}
