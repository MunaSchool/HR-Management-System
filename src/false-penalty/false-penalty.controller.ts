import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FalsePenaltyService } from './false-penalty.service';
import { CreateFalsePenaltyDto } from './dto/create-false-penalty.dto';
import { UpdateFalsePenaltyDto } from './dto/update-false-penalty.dto';

@Controller('false-penalty')
export class FalsePenaltyController {
  constructor(private readonly falsePenaltyService: FalsePenaltyService) {}

  @Post()
  create(@Body() createFalsePenaltyDto: CreateFalsePenaltyDto) {
    return this.falsePenaltyService.create(createFalsePenaltyDto);
  }

  @Get()
  findAll() {
    return this.falsePenaltyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.falsePenaltyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFalsePenaltyDto: UpdateFalsePenaltyDto) {
    return this.falsePenaltyService.update(+id, updateFalsePenaltyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.falsePenaltyService.remove(+id);
  }
}
