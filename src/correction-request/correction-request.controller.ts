import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorrectionRequestService } from './correction-request.service';
import { CreateCorrectionRequestDto } from './dto/create-correction-request.dto';
import { UpdateCorrectionRequestDto } from './dto/update-correction-request.dto';

@Controller('correction-request')
export class CorrectionRequestController {
  constructor(private readonly correctionRequestService: CorrectionRequestService) {}

  @Post()
  create(@Body() createCorrectionRequestDto: CreateCorrectionRequestDto) {
    return this.correctionRequestService.create(createCorrectionRequestDto);
  }

  @Get()
  findAll() {
    return this.correctionRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correctionRequestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCorrectionRequestDto: UpdateCorrectionRequestDto) {
    return this.correctionRequestService.update(+id, updateCorrectionRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.correctionRequestService.remove(+id);
  }
}
