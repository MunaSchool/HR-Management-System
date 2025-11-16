import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OvertimeSchema } from './models/overtime.model';

@Module({
  imports: [MongooseModule.forFeature([{name:"Overtime", schema: OvertimeSchema}])],
  controllers: [OvertimeController],
  providers: [OvertimeService],
})
export class OvertimeModule {}
