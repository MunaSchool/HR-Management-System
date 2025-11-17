import { Injectable } from '@nestjs/common';
import { CreateFalsePenaltyDto } from './dto/create-false-penalty.dto';
import { UpdateFalsePenaltyDto } from './dto/update-false-penalty.dto';

@Injectable()
export class FalsePenaltyService {
  create(createFalsePenaltyDto: CreateFalsePenaltyDto) {
    return 'This action adds a new falsePenalty';
  }

  findAll() {
    return `This action returns all falsePenalty`;
  }

  findOne(id: number) {
    return `This action returns a #${id} falsePenalty`;
  }

  update(id: number, updateFalsePenaltyDto: UpdateFalsePenaltyDto) {
    return `This action updates a #${id} falsePenalty`;
  }

  remove(id: number) {
    return `This action removes a #${id} falsePenalty`;
  }
}
