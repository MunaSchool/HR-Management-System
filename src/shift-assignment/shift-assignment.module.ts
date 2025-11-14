import { Module } from '@nestjs/common';
import { ShiftAssignmentSchema } from './models/shift-assignment.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports:[MongooseModule.forFeature([{name: 'shift-assignment', schema: ShiftAssignmentSchema}])],
    controllers: [],
    providers: []
})
export class ShiftAssignmentModule {}
