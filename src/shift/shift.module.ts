import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shift, ShiftSchema } from './models/shift.model';

@Module({
    imports: [MongooseModule.forFeature([{name: "shift", schema: ShiftSchema}])]
})
export class ShiftModule {
    
}
