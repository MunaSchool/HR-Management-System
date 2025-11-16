import { Injectable } from '@nestjs/common';
import { CreateCorrectionRequestDto } from './dto/create-correction-request.dto';
import { UpdateCorrectionRequestDto } from './dto/update-correction-request.dto';

@Injectable()
export class CorrectionRequestService {
  create(createCorrectionRequestDto: CreateCorrectionRequestDto) {
    return 'This action adds a new correctionRequest';
  }

  findAll() {
    return `This action returns all correctionRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correctionRequest`;
  }

  update(id: number, updateCorrectionRequestDto: UpdateCorrectionRequestDto) {
    return `This action updates a #${id} correctionRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} correctionRequest`;
  }
}
