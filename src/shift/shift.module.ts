import { Module } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { ShiftController } from './shift.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftSchema } from './models/shift.model';

@Module({
  imports: [MongooseModule.forFeature([{name: "Shift", schema: ShiftSchema}])],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
