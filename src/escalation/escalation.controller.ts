import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EscalationService } from './escalation.service';
import { CreateEscalationDto } from './dto/create-escalation.dto';
import { UpdateEscalationDto } from './dto/update-escalation.dto';

@Controller('escalation')
export class EscalationController {
  constructor(private readonly escalationService: EscalationService) {}

  @Post()
  create(@Body() createEscalationDto: CreateEscalationDto) {
    return this.escalationService.create(createEscalationDto);
  }

  @Get()
  findAll() {
    return this.escalationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.escalationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEscalationDto: UpdateEscalationDto) {
    return this.escalationService.update(+id, updateEscalationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.escalationService.remove(+id);
  }
}
