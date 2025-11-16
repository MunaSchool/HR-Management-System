import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShiftAssignmentService } from './shift-assignment.service';
import { CreateShiftAssignmentDto } from './dto/create-shift-assignment.dto';
import { UpdateShiftAssignmentDto } from './dto/update-shift-assignment.dto';

@Controller('shift-assignment')
export class ShiftAssignmentController {
  constructor(private readonly shiftAssignmentService: ShiftAssignmentService) {}

  @Post()
  create(@Body() createShiftAssignmentDto: CreateShiftAssignmentDto) {
    return this.shiftAssignmentService.create(createShiftAssignmentDto);
  }

  @Get()
  findAll() {
    return this.shiftAssignmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shiftAssignmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id:string, @Body() updateShiftAssignmentDto: UpdateShiftAssignmentDto) {
    return this.shiftAssignmentService.update(id, updateShiftAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shiftAssignmentService.remove(id);
  }
}
