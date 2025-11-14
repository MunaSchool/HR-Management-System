import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CorrectionRequest, CorrectionRequestSchema } from './models/correction-request.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CorrectionRequest', schema: CorrectionRequestSchema },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [MongooseModule],
})
export class CorrectionRequestModule {}
