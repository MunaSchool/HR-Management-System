import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OffboardingService } from './offboarding.service';
import { CreateOffboardingDto } from './dto/create-offboarding.dto';
import { UpdateOffboardingDto } from './dto/update-offboarding.dto';

@Controller('offboarding')
export class OffboardingController {
  constructor(private readonly offboardingService: OffboardingService) {}

  @Post()
  create(@Body() createOffboardingDto: CreateOffboardingDto) {
    return this.offboardingService.create(createOffboardingDto);
  }

  @Get()
  findAll() {
    return this.offboardingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offboardingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOffboardingDto: UpdateOffboardingDto) {
    return this.offboardingService.update(+id, updateOffboardingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offboardingService.remove(+id);
  }
}
